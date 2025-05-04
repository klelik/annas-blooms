import type {
  CartFragment,
  CustomerFragment,
  ViewerFragment,
  PaymentGatewayFragment,
  OrderFragmentFragment,
  GetProductQuery,
  SimpleProductFragment,
  VariableProductFragment,
  ExternalProductFragment,
  ProductWithAttributesFragment,
  DownloadableItemFragment,
  ProductCategoryFragment,
  AddressFragment,
  TermsFragment,
  VariationAttributeFragment,
  CommentFragment,
  ProductAttributeFragment,
  LoginClientFragment,
  StockStatusEnum,
} from '#gql'

export type Cart = CartFragment
export type Customer = CustomerFragment
export type Viewer = ViewerFragment
export type PaymentGateway = PaymentGatewayFragment
export type Order = OrderFragmentFragment
export type ProductBase = GetProductQuery['product']
export type SimpleProduct = SimpleProductFragment
export type VariableProduct = VariableProductFragment
export type ExternalProduct = ExternalProductFragment
export type ProductWithAttributes = ProductWithAttributesFragment
export type ProductCategory = ProductCategoryFragment
export type Product = ProductBase &
  SimpleProduct &
  VariableProduct &
  ExternalProduct &
  ProductWithAttributes
export type Address = AddressFragment
export type Terms = TermsFragment
export type VariationAttribute = VariationAttributeFragment
export type Comment = CommentFragment
export type ProductAttribute = ProductAttributeFragment
export type LoginClient = LoginClientFragment

export interface ProductAttributeInput {
  attributeName: string
  attributeValue: string
}

export interface PaymentGateways {
  nodes?: PaymentGateway[] | null
}

export interface Variation {
  name?: string | null | undefined
  databaseId?: number | null | undefined
  price?: string | null | undefined
  regularPrice?: string | null | undefined
  salePrice?: string | null | undefined
  slug?: string | null | undefined
  stockQuantity?: number | null | undefined
  stockStatus?: StockStatusEnum | null | undefined
  hasAttributes?: boolean | null | undefined
  image?: ProductImage | null | undefined
  attributes?: { nodes?: VariationAttribute[] | null | undefined } | null | undefined
  node?: SimpleProduct | VariableProduct | null | undefined
}

export interface ProductImage {
  sourceUrl?: string | null | undefined
  cartSourceUrl?: string | null | undefined
  altText?: string | null | undefined
  title?: string | null | undefined
}

export interface AppliedCoupon {
  description?: string | null | undefined
  discountTax: string
  discountAmount: string
  code: string
}

export interface ShippingMethodRate {
  cost?: string | null | undefined
  id: string
  label?: string | null | undefined
}

export interface GeoLocation {
  code: string
  name: string
}

export interface LineItem {
  quantity?: number | null | undefined
  total?: string | null | undefined
  product?: Product | null | undefined
  variation?: Variation | null | undefined
}

export interface WooNuxtSEOItem {
  provider: string
  url?: string | null | undefined
  handle?: string | null | undefined
}

export interface WooNuxtFilter {
  slug: string
  label?: string | null | undefined
  hideEmpty: boolean
  showCount: boolean
  openByDefault: boolean
  terms: Terms
}

export interface UserInfo {
  email: string
  password: string
  username: string
}
