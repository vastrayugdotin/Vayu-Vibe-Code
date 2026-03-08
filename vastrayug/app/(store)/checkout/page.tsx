import Link from 'next/link'

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl text-center">
      <h1 className="font-heading text-heading-xl text-stardust-white mb-6">
        Checkout
      </h1>
      <div className="bg-void-black border border-white/10 p-12 max-w-2xl mx-auto rounded-lg">
        <span className="text-4xl text-nebula-gold mb-6 block">✦</span>
        <h2 className="font-heading text-2xl text-stardust-white mb-4">
          Aligning Your Order
        </h2>
        <p className="font-body text-eclipse-silver mb-8 leading-relaxed">
          The checkout flow including address collection, shipping calculation, and Razorpay integration is currently under construction and will be available in the next phase of our cosmic journey.
        </p>
        <Link
          href="/cart"
          className="inline-block border border-nebula-gold text-nebula-gold px-8 py-3 font-body text-sm tracking-widest uppercase hover:bg-nebula-gold hover:text-cosmic-black transition-colors"
        >
          Return to Cart
        </Link>
      </div>
    </div>
  )
}
