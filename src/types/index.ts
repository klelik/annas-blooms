import type {
  SimpleProductFragment as SimpleProduct,
  VariableProductFragment as VariableProduct,
  ExternalProductFragment as ExternalProduct,
  ProductWithAttributesFragment as ProductWithAttributes,
  VariationAttributeFragment as VariationAttribute,
} from '#gql'
type ProductBase = import('#gql').GetProductQuery['product']
export interface Variation {
  name?: string | null
  databaseId?: number
  price?: string | null
  regularPrice?: string | null
  salePrice?: string | null
  slug?: string | null
  stockQuantity?: number | null
  stockStatus?: StockStatusEnum | null
  hasAttributes?: boolean | null
  image?: Image | null
  attributes?: { nodes?: VariationAttribute[] } | null
  node?: SimpleProduct | VariableProduct
}

export type Product = ProductBase &
  SimpleProduct &
  VariableProduct &
  ExternalProduct &
  ProductWithAttributes
export interface Link {
  name?: string
  params?: { [key: string]: string }
  url?: string
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
  onSale: boolean
  regularPrice?: string
  salePrice?: string
  price?: string
  averageRating: number
  product: Product
  type: ProductTypesEnum
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
