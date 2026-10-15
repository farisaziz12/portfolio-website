// Preserve Markdown authoring and Slidev's parser; only decorate rendered H1s.
export default {
  slidev: {
    // Vue only base-prefixes asset paths on known tags. Add SlidevVideo's
    // posters so a build under /talks/<deck>/ finds them; a tag map replaces
    // Vue's defaults, so those are repeated here.
    vue: {
      template: {
        transformAssetUrls: {
          video: ['src', 'poster'],
          source: ['src'],
          img: ['src'],
          image: ['xlink:href', 'href'],
          use: ['xlink:href', 'href'],
          SlidevVideo: ['poster', 'printPoster'],
        },
      },
    },
    markdown: {
      markdownSetup(md) {
        for (const kind of ['heading_open', 'heading_close']) {
          const original = md.renderer.rules[kind]
          md.renderer.rules[kind] = (tokens, index, options, env, renderer) => {
            const html = original?.(tokens, index, options, env, renderer)
              ?? renderer.renderToken(tokens, index, options)
            if (tokens[index].tag !== 'h1') return html
            const group = tokens.slice(0, index).filter(t => t.type === 'heading_open' && t.tag === 'h1').length
            return kind === 'heading_open'
              ? html.replace('<h1', `<MagicHeading group="${group}"`)
              : html.replace('</h1>', '</MagicHeading>')
          }
        }
      },
    },
  },
}
