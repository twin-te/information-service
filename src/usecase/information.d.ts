declare module '*/information.json' {
  type tag = 'information' | 'notification' | null

  export interface information {
    id: string
    tags: tag[]
    title: string
    content: string
    publishedAt: string
  }
}
