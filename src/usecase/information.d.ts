declare module '*/information.json' {
  interface information {
    id: string
    tags: [string]
    title: string
    content: string
    publishedAt: string
  }

  const value: information
  export = value
}
