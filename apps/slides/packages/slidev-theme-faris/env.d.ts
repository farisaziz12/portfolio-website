import 'vue'

declare module 'vue' {
  interface ComponentCustomProperties {
    $page: number
    $frontmatter: Record<string, any>
    $slidev: {
      themeConfigs: Record<string, unknown>
    }
  }
}

export {}
