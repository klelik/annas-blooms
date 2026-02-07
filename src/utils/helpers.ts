import { appName } from './constants'

export const getPageTitle = (value?: string) => {
  if (!value) return appName
  return `${value} | ${appName}`
}

export const getBaseUrl = () => {
  const config = useRuntimeConfig()
  return config.public.baseUrl || '/'
}

export function randomizeArray<T>(array: T[]): T[] {
  const randomizedArray = [...array]

  // Fisher-Yates (Knuth) Shuffle Algorithm
  for (let i = randomizedArray.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1))
    // Swap the current element with a random element
    ;[randomizedArray[i], randomizedArray[randomIndex]] = [
      randomizedArray[randomIndex],
      randomizedArray[i],
    ]
  }

  return randomizedArray
}

export const getRawPrice = (price: string | null | undefined): number => {
  if (!price) return 0
  const { currency } = useAppConfig()
  const priceWithoutCurrency = price.replace(currency.symbol, '').trim()
  return parseFloat(priceWithoutCurrency) || 0
}

export const isValidPostcodeFormat = (postcode: string) => {
  const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i
  return ukPostcodeRegex.test(postcode.trim())
}

export const getImage = (image: any): Image | null => {
  if (!image) return null

  return {
    src: image?.producCardSourceUrl || image?.sourceUrl || '',
    alt: image?.altText || image?.title || '',
    width: 500,
    height: 500,
  }
}

export const stripHtml = (html: string): string => {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').trim()
}
