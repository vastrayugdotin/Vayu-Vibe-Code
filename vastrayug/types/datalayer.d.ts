// ─────────────────────────────────────────────────────────────
// Vastrayug — DataLayer Type Declarations
// Reference: tracking_events.md §3.2
//
// Extends the global Window interface with GTM DataLayer,
// Google gtag, and Meta Pixel fbq.
// ─────────────────────────────────────────────────────────────

export {}

// ── GA4 E-Commerce Item ──────────────────────────────────────

interface Ga4EcommerceItem {
  item_id: string
  item_name: string
  item_category: string
  item_category2?: string
  item_variant?: string
  price: number
  quantity?: number
  // Vastrayug cosmic custom dimensions
  item_planet?: string
  item_zodiac?: string
  item_collection?: string
}

// ── GA4 E-Commerce Payload ───────────────────────────────────

interface Ga4EcommercePayload {
  currency?: string
  value?: number
  transaction_id?: string
  affiliation?: string
  tax?: number
  shipping?: number
  coupon?: string
  shipping_tier?: string
  payment_type?: string
  item_list_id?: string
  item_list_name?: string
  items?: Ga4EcommerceItem[]
}

// ── DataLayer Event Types ────────────────────────────────────

interface DataLayerBaseEvent {
  event: string
  [key: string]: unknown
}

interface DataLayerPageViewEvent extends DataLayerBaseEvent {
  event: 'page_view'
  page_path: string
  page_title: string
}

interface DataLayerEcommerceEvent extends DataLayerBaseEvent {
  event:
    | 'view_item'
    | 'view_item_list'
    | 'select_item'
    | 'add_to_cart'
    | 'remove_from_cart'
    | 'view_cart'
    | 'begin_checkout'
    | 'add_shipping_info'
    | 'add_payment_info'
    | 'purchase'
  ecommerce: Ga4EcommercePayload
}

interface DataLayerEcommerceClearEvent {
  ecommerce: null
}

interface DataLayerSignUpEvent extends DataLayerBaseEvent {
  event: 'sign_up'
  method: 'email' | 'google'
}

interface DataLayerLoginEvent extends DataLayerBaseEvent {
  event: 'login'
  method: 'email' | 'google'
}

interface DataLayerSearchEvent extends DataLayerBaseEvent {
  event: 'search'
  search_term: string
}

type DataLayerEvent =
  | DataLayerBaseEvent
  | DataLayerPageViewEvent
  | DataLayerEcommerceEvent
  | DataLayerEcommerceClearEvent
  | DataLayerSignUpEvent
  | DataLayerLoginEvent
  | DataLayerSearchEvent

// ── Window Augmentation ──────────────────────────────────────

declare global {
  interface Window {
    dataLayer: DataLayerEvent[]
    gtag?: (...args: unknown[]) => void
    fbq?: (action: string, event: string, data?: Record<string, unknown>) => void
  }
}
