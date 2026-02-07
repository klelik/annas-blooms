import { reactive, ref, computed, watch, readonly } from 'vue'

// Types
interface PostcodeResult {
  postcode: string
  quality: number
  eastings: number
  northings: number
  country: string
  nhs_ha: string
  longitude: number
  latitude: number
  parliamentary_constituency: string
  european_electoral_region: string
  primary_care_trust: string
  region: string
  lsoa: string
  msoa: string
  incode: string
  outcode: string
  parliamentary_constituency_2024: string
  admin_district: string
  parish: string
  admin_county: string
  admin_ward: string
  ccg: string
  nuts: string
  codes: Record<string, string>
}

interface PostcodeApiResponse {
  status: number
  result: PostcodeResult | null
  error?: string
}

interface NominatimAddress {
  house_number?: string
  road?: string
  suburb?: string
  town?: string
  city?: string
  county?: string
  state?: string
  postcode?: string
  country?: string
  country_code?: string
}

interface NominatimResponse {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  lat: string
  lon: string
  display_name: string
  address: NominatimAddress
  boundingbox: string[]
}

interface PostcodeStatus {
  isValid: boolean
  isLoading: boolean
  message: string
  coordinates: { lat: number; lng: number } | null
  district: string
  hasFormatError: boolean
}

interface StreetSuggestion {
  show: boolean
  street: string
  confirmed: boolean
  source: string
  isCorrect: boolean
  isWrong: boolean
}

interface FinalAddress {
  show: boolean
  formatted: string
}

interface AddressData {
  houseNumber?: string
  streetName?: string
  townCity?: string
  county?: string
  postcode?: string
  [key: string]: any
}

interface PostcodeLookupResult {
  success: boolean
  data?: PostcodeResult
  streetFound?: boolean
  street?: string | null
  error?: string
  errorCode?: 'INVALID_FORMAT' | 'NOT_FOUND' | 'NETWORK_ERROR' | 'API_ERROR' | 'RATE_LIMITED'
}

interface StreetLookupResult {
  success: boolean
  street: string | null
  source?: string
  error?: string
}

interface UsePostcodeOptions {
  userAgent?: string
  timeout?: number
  enableStreetLookup?: boolean
  retryAttempts?: number
  retryDelay?: number
}

// Constants
const UK_POSTCODE_REGEX = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i
const DEFAULT_USER_AGENT = 'AddressLookup/1.0'
const DEFAULT_TIMEOUT = 10000
const DEFAULT_RETRY_ATTEMPTS = 2
const DEFAULT_RETRY_DELAY = 1000

export function usePostcode(options: UsePostcodeOptions = {}) {
  const {
    userAgent = DEFAULT_USER_AGENT,
    timeout = DEFAULT_TIMEOUT,
    enableStreetLookup = true,
    retryAttempts = DEFAULT_RETRY_ATTEMPTS,
    retryDelay = DEFAULT_RETRY_DELAY,
  } = options

  const postcodeStatus = reactive<PostcodeStatus>({
    isValid: false,
    isLoading: false,
    message: '',
    coordinates: null,
    district: '',
    hasFormatError: false,
  })

  const streetSuggestion = reactive<StreetSuggestion>({
    show: false,
    street: '',
    confirmed: false,
    source: '',
    isCorrect: false,
    isWrong: false,
  })

  const showAddressForm = ref<boolean>(false)

  const finalAddress = reactive<FinalAddress>({
    show: false,
    formatted: '',
  })

  const getStatusClass = computed(() => {
    if (postcodeStatus.isLoading) return 'postcode-status status-loading'
    if (postcodeStatus.isValid) return 'postcode-status status-valid'
    return 'postcode-status status-invalid'
  })

  const isPostcodeValid = computed(() => postcodeStatus.isValid)

  // Utilities
  const isValidPostcodeFormat = (postcode: string): boolean => {
    if (!postcode) return false
    return UK_POSTCODE_REGEX.test(postcode.trim())
  }

  const sanitizePostcode = (postcode: string): string => {
    return postcode.trim().toUpperCase().replace(/\s+/g, ' ')
  }

  const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // Reset
  const resetAddressState = (): void => {
    postcodeStatus.message = ''
    postcodeStatus.isValid = false
    postcodeStatus.coordinates = null
    postcodeStatus.district = ''
    postcodeStatus.hasFormatError = false

    streetSuggestion.show = false
    streetSuggestion.street = ''
    streetSuggestion.confirmed = false
    streetSuggestion.source = ''
    streetSuggestion.isCorrect = false
    streetSuggestion.isWrong = false

    showAddressForm.value = false
    finalAddress.show = false
    finalAddress.formatted = ''
  }

  // API request with timeout and retry
  const fetchWithRetry = async (
    url: string,
    options: RequestInit = {},
    attempt = 1
  ): Promise<Response> => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return response
    } catch (error) {
      clearTimeout(timeoutId)

      if (attempt < retryAttempts) {
        console.warn(`Request failed (attempt ${attempt}/${retryAttempts}), retrying...`, error)
        await sleep(retryDelay)
        return fetchWithRetry(url, options, attempt + 1)
      }

      throw error
    }
  }

  // Validate postcode format
  const validatePostcodeFormat = (postcode: string): { isValid: boolean; error?: string } => {
    if (!postcode) {
      return { isValid: false, error: 'EMPTY' }
    }

    const isValidFormat = isValidPostcodeFormat(postcode)

    if (!isValidFormat) {
      postcodeStatus.hasFormatError = true
      postcodeStatus.message = 'Please enter a valid UK postcode'
      postcodeStatus.isValid = false
      return { isValid: false, error: 'INVALID_FORMAT' }
    }

    postcodeStatus.hasFormatError = false
    return { isValid: true }
  }

  // Main postcode lookup function
  const lookupPostcode = async (
    postcode: string,
    formData?: AddressData
  ): Promise<PostcodeLookupResult> => {
    const cleanPostcode = sanitizePostcode(postcode)

    // Validate format first
    const formatValidation = validatePostcodeFormat(cleanPostcode)
    if (!formatValidation.isValid) {
      if (formatValidation.error === 'INVALID_FORMAT') {
        return {
          success: false,
          error: 'Invalid UK postcode format',
          errorCode: 'INVALID_FORMAT',
        }
      }
      if (formatValidation.error === 'EMPTY') {
        resetAddressState()
        return {
          success: false,
          error: 'Postcode is required',
          errorCode: 'INVALID_FORMAT',
        }
      }
    }

    // Check minimum length
    if (cleanPostcode.length < 5) {
      return {
        success: false,
        error: 'Postcode too short',
        errorCode: 'INVALID_FORMAT',
      }
    }

    postcodeStatus.isLoading = true
    postcodeStatus.message = 'Validating postcode...'
    postcodeStatus.hasFormatError = false

    try {
      // postcodes.io API
      const url = `https://api.postcodes.io/postcodes/${cleanPostcode.replace(/\s/g, '')}`
      const response = await fetchWithRetry(url)
      const data: PostcodeApiResponse = await response.json()

      if (data.status === 200 && data.result) {
        const result = data.result

        // Update status
        postcodeStatus.isValid = true
        postcodeStatus.coordinates = {
          lat: result.latitude,
          lng: result.longitude,
        }
        postcodeStatus.district = result.admin_district || result.parish || ''
        postcodeStatus.message = `Valid postcode in ${result.admin_district || result.country}`

        // Pre-fill form data
        if (formData) {
          formData.townCity = result.admin_district || result.parish || ''
          formData.county = result.admin_county || result.country || ''
        }

        // Step 2: Attempt street lookup if enabled
        let streetResult: StreetLookupResult = { success: false, street: null }
        if (enableStreetLookup) {
          streetResult = await attemptStreetLookup(result.latitude, result.longitude)
        } else {
          showAddressForm.value = true
        }

        return {
          success: true,
          data: result,
          streetFound: streetResult.success,
          street: streetResult.street,
        }
      } else {
        postcodeStatus.isValid = false
        postcodeStatus.message = 'Invalid postcode. Please check and try again.'
        postcodeStatus.coordinates = null
        streetSuggestion.confirmed = false

        return {
          success: false,
          error: 'Postcode not found',
          errorCode: 'NOT_FOUND',
        }
      }
    } catch (error) {
      console.error('Postcode lookup error:', error)
      postcodeStatus.isValid = false
      showAddressForm.value = true

      // Handle different error types
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          postcodeStatus.message = 'Request timed out. Please try again.'
          return {
            success: false,
            error: 'Request timeout',
            errorCode: 'NETWORK_ERROR',
          }
        }

        if (error.message.includes('429')) {
          postcodeStatus.message = 'Too many requests. Please wait a moment.'
          return {
            success: false,
            error: 'Rate limited',
            errorCode: 'RATE_LIMITED',
          }
        }
      }

      postcodeStatus.message = 'Unable to validate postcode. Please enter address manually.'
      return {
        success: false,
        error: 'Network error',
        errorCode: 'NETWORK_ERROR',
      }
    } finally {
      postcodeStatus.isLoading = false
    }
  }

  // Street lookup via reverse geocoding
  const attemptStreetLookup = async (lat: number, lng: number): Promise<StreetLookupResult> => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      const response = await fetchWithRetry(url, {
        headers: {
          'User-Agent': userAgent,
        },
      })

      const osmData: NominatimResponse = await response.json()

      if (osmData && osmData.address && osmData.address.road) {
        streetSuggestion.street = osmData.address.road
        streetSuggestion.source = 'OpenStreetMap'
        streetSuggestion.show = true
        postcodeStatus.message += ` • Street found: ${osmData.address.road}`

        return {
          success: true,
          street: osmData.address.road,
          source: 'OpenStreetMap',
        }
      }

      // No street found - show manual entry
      showAddressForm.value = true
      postcodeStatus.message += ' • Please enter your address details.'

      return { success: false, street: null }
    } catch (error) {
      console.warn('Street lookup failed:', error)
      showAddressForm.value = true
      postcodeStatus.message += ' • Please enter your address details.'

      return {
        success: false,
        street: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // Street confirmation handlers
  const handleStreetConfirmation = (isCorrect: boolean, formData?: AddressData): void => {
    if (isCorrect) {
      streetSuggestion.isCorrect = true
      streetSuggestion.isWrong = false
      confirmSuggestedStreet(formData)
    } else {
      streetSuggestion.isCorrect = false
      streetSuggestion.isWrong = true
      enterCustomAddress(formData)
    }
  }

  const confirmSuggestedStreet = (formData?: AddressData): void => {
    if (formData && streetSuggestion.street) {
      formData.streetName = streetSuggestion.street
    }
    streetSuggestion.confirmed = true
    showAddressForm.value = true
  }

  const enterCustomAddress = (formData?: AddressData): void => {
    showAddressForm.value = true
    if (formData) {
      formData.streetName = ''
    }
    streetSuggestion.confirmed = false
  }

  // Address formatting
  const formatAddress = (addressData: AddressData): string => {
    const parts = [
      addressData.houseNumber,
      addressData.streetName,
      addressData.townCity,
      addressData.county,
      addressData.postcode,
    ].filter(Boolean)

    return parts.join(', ')
  }

  // Address completion watcher
  const watchAddressCompletion = (
    formData: AddressData,
    callback?: (formatted: string) => void
  ) => {
    return watch(
      [
        () => formData.houseNumber,
        () => formData.streetName,
        () => formData.townCity,
        () => formData.postcode,
      ],
      () => {
        if (formData.houseNumber && formData.streetName && formData.townCity && formData.postcode) {
          const formatted = formatAddress(formData)

          finalAddress.formatted = formatted
          finalAddress.show = true
          showAddressForm.value = false

          if (callback) {
            callback(formatted)
          }
        }
      },
      { deep: true }
    )
  }

  // Edit address
  const editAddress = (): void => {
    finalAddress.show = false
    showAddressForm.value = true
  }

  // Get validation status for form libraries
  const getValidationStatus = (postcode: string) => {
    if (!postcode) return { isValid: true, message: '' }

    const formatValidation = validatePostcodeFormat(postcode)
    if (!formatValidation.isValid && formatValidation.error === 'INVALID_FORMAT') {
      return { isValid: false, message: 'Please enter a valid UK postcode' }
    }

    if (postcodeStatus.isLoading) {
      return { isValid: true, message: 'Validating postcode...' }
    }

    if (postcodeStatus.message && !postcodeStatus.isValid && !postcodeStatus.hasFormatError) {
      return { isValid: false, message: postcodeStatus.message }
    }

    return { isValid: true, message: '' }
  }

  // Return all reactive state and functions
  return {
    // State (readonly to prevent external mutation)
    postcodeStatus: readonly(postcodeStatus),
    streetSuggestion: readonly(streetSuggestion),
    showAddressForm: readonly(showAddressForm),
    finalAddress: readonly(finalAddress),

    // Computed
    getStatusClass,
    isPostcodeValid,

    // Core functions
    lookupPostcode,
    resetAddressState,
    handleStreetConfirmation,
    confirmSuggestedStreet,
    enterCustomAddress,
    editAddress,
    formatAddress,
    watchAddressCompletion,
    getValidationStatus,

    // Utility functions
    isValidPostcodeFormat,
    sanitizePostcode,
    validatePostcodeFormat,
    attemptStreetLookup,
  }
}
