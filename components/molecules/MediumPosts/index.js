import React from "react";

function getShortDate(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}/${year}`;
}

const Post = ({ post }) => {
  const { title, link, imageSrc, published } = post;

  return (
    <div className="w-full max-w-[800px] rounded overflow-hidden shadow-lg border-solid border-white border-2  transition-all duration-500 transform hover:translate-y-2">
      <a href={link} target="_blank" rel="noopener noreferrer">
        <div
          className="relative h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageSrc})` }}
        >
          <div className="absolute inset-0 bg-black opacity-90"></div>
          <h2 className="absolute p-4 text-white text-2xl font-semibold">{title}</h2>
        </div>
      </a>
      <div className="px-6 py-4">
        <div className="font-semibold text-xl mb-2">{getShortDate(published)}</div>
      </div>
    </div>
  );
};

export const PostsGrid = ({ posts, className }) => {
  return (
    <div id="posts">
      <h1 className="lg:text-4xl text-center">Featured Blog Posts</h1>
      <div className={"grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center mx-auto mb-32 p-8"}>
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};
