export interface Link {
  name?: string
  url: string
  target?: string
}
export interface Image {
  src: string
  alt: string
  width?: number
  height?: number
  size?: number
  type?: string
  caption?: string
}

export type Size = 'sm' | 'md' | 'lg'
export type Alignment = 'left' | 'center' | 'right'

//=============================
// Components
//=============================

export interface SectionHeader {
  title?: string
  description?: string
  tag?: string
  alignment?: Alignment
  link?: Link
  tagElement?: string
}

export interface Card {
  image: Image
  title: string
  tags?: string[]
  description?: string
  link?: Link
}

export interface Response<T> {
  success: boolean
  data?: T | null
  message?: string | null
  total?: number | null
}

export interface MetaData {
  title?: string
  description?: string
}

//=============================
// GRAPHQL TYPES
//=============================
export * from './woo'
