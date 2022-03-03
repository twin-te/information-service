declare module '*/information.json' {
  type tag = 'information' | 'notification' | null

  interface information {
    id: string
    tags: tag[]
    title: string
    content: string
    publishedAt: string
  }

  const value: information
  export = value
}
