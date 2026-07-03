import type { APIRoute } from 'astro';
import { sanityFetch } from '../../lib/sanity/client';
import { allBlogPostsQuery, blogPostBySlugQuery } from '../../lib/sanity/queries';
import { mdResponse, mdDate, portableTextToMarkdown } from '../../lib/markdown';

interface PostListItem {
  slug: string;
}

interface PostDetail {
  title: string;
  slug: string;
  excerpt?: string;
  body?: unknown;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
  category?: string;
}

export async function getStaticPaths() {
  const posts = await sanityFetch<PostListItem[]>(allBlogPostsQuery).catch(() => []);
  return posts.map((p) => ({ params: { slug: p.slug } }));
}

export const GET: APIRoute = async ({ params }) => {
  const post = await sanityFetch<PostDetail | null>(blogPostBySlugQuery, { slug: params.slug }).catch(() => null);
  if (!post) return new Response('Not found', { status: 404 });

  const body = [
    `# ${post.title}`,
    ``,
    `> By Faris Aziz · published ${mdDate(post.publishedAt)}${post.updatedAt ? ` · updated ${mdDate(post.updatedAt)}` : ''}${post.tags?.length ? ` · ${post.tags.join(', ')}` : ''}`,
    ``,
    post.excerpt || '',
    ``,
    portableTextToMarkdown(post.body),
    ``,
    `Canonical: https://faziz-dev.com/blog/${post.slug}`,
  ]
    .filter(Boolean)
    .join('\n');

  return mdResponse(body);
};
