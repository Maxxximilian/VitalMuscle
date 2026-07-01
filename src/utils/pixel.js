const fbq = (...args) => { if (window.fbq) window.fbq(...args) }

export const pixelViewContent  = ()      => fbq('track', 'ViewContent')
export const pixelInitCheckout = ()      => fbq('track', 'InitiateCheckout')
export const pixelAddToCart    = ()      => fbq('track', 'AddToCart')
export const pixelPurchase     = (value) => fbq('track', 'Purchase', { value, currency: 'EUR' })
