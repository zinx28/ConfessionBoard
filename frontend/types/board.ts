export type Board = {
  id: string,
  owner_id: string,
  title: string,
  description: string,
  anonymous: boolean,
  allowMultiple: boolean,
  theme: string,
  background: string
}

export interface BoardSettings {
    title: string
    description: string
    allowMultiple: boolean
    requireModeration: boolean
    allowAnonymous: boolean
    maxLength: string
    cooldownPeriod: string
    theme: string,
    isPublic: boolean
    customSlug: string
}

export interface BoardView {
  id: string
  title: string
  description: string
  message_count: number
}