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

export const getRawPrice = (price: string) => {
  const { currency } = useAppConfig()
  const priceWithoutCurrency = price.replace(currency.symbol, '').trim()
  return parseFloat(priceWithoutCurrency)
}

export const isValidPostcodeFormat = (postcode: string) => {
  const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i
  return ukPostcodeRegex.test(postcode.trim())
}
