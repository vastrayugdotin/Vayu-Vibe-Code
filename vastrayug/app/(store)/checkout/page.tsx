"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";
import CheckoutProgress from "@/components/store/checkout/CheckoutProgress";
import AddressForm from "@/components/store/checkout/AddressForm";
import ShippingMethodSelector, { type ShippingMethod } from "@/components/store/checkout/ShippingMethodSelector";
import OrderReviewStep from "@/components/store/checkout/OrderReviewStep";
import RazorpayButton from "@/components/store/checkout/RazorpayButton";
import { toast } from "react-hot-toast";
import { pushEcommerceEvent, pushPixelEvent } from "@/lib/datalayer";
import { ChevronLeft, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [shippingAddress, setShippingAddress] = React.useState<any>(null);
  const [shippingMethod, setShippingMethod] = React.useState<ShippingMethod | null>(null);
  const [guestEmail, setGuestEmail] = React.useState("");

  const subtotal = getTotalPrice();
  const discount = 0; // TODO: Implement coupon logic
  const tax = Math.round(subtotal * 0.12); // 12% GST included mock
  const shippingCost = shippingMethod?.price || 0;
  const total = subtotal + shippingCost - discount;

  // Analytics: begin_checkout
  React.useEffect(() => {
    if (items.length > 0) {
      pushEcommerceEvent("begin_checkout", {
        currency: "INR",
        value: total,
        items: items.map((item) => ({
          item_id: item.productId,
          item_name: item.title,
          price: item.price,
          quantity: item.quantity,
          item_variant: item.variant?.size,
        })),
      });

      pushPixelEvent("InitiateCheckout", {
        content_ids: items.map((i) => i.productId),
        content_type: "product",
        value: total,
        currency: "INR",
      });
    }
  }, [items.length]);

  // Redirect if cart empty
  React.useEffect(() => {
    if (status !== "loading" && items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, status, router]);

  const handleAddressSubmit = (data: any) => {
    setShippingAddress(data);

    // 4.9c: Fire add_shipping_info DataLayer event (Address part)
    pushEcommerceEvent("add_shipping_info", {
      currency: "INR",
      value: total,
      items: items.map((item) => ({
        item_id: item.productId,
        item_name: item.title,
        price: item.price,
        quantity: item.quantity,
        item_variant: item.variant?.size,
      })),
    });

    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleShippingSelect = (method: ShippingMethod) => {
    setShippingMethod(method);
    // Analytics: add_shipping_info
    pushEcommerceEvent("add_shipping_info", {
      currency: "INR",
      value: total,
      shipping_tier: method.name,
      items: items.map((item) => ({
        item_id: item.productId,
        item_name: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
    });
    setStep(3);
    window.scrollTo(0, 0);
  };

  const handlePaymentSuccess = async (response: any) => {
    try {
      const res = await fetch("/api/storefront/checkout/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
          orderNumber: response.orderNumber,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        clearCart();
        router.push(`/order-confirmation/${data.data.orderId}`);
      } else {
        throw new Error(data.message || "Payment verification failed");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-void-black font-body text-stardust-white">
      {/* Simple Checkout Header */}
      <header className="border-b border-white/10 py-6">
        <div className="container mx-auto flex items-center justify-between px-4 max-w-7xl">
          <Link href="/" className="font-heading text-2xl tracking-widest flex items-center gap-2">
            <span className="text-nebula-gold">✦</span> VASTRAYUG
          </Link>
          <div className="flex items-center gap-2 text-eclipse-silver">
            <Lock className="h-4 w-4" />
            <span className="text-[10px] uppercase tracking-widest font-bold">Secure Checkout</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-12 md:py-20">
        <div className="flex flex-col gap-16 lg:flex-row">
          {/* Checkout Steps */}
          <div className="flex-1">
            <CheckoutProgress currentStep={step} />

            <div className="mt-12">
              {step === 1 && (
                <div className="animate-fade-in">
                  <h2 className="mb-8 font-heading text-2xl uppercase tracking-widest text-stardust-white">
                    Shipping Information
                  </h2>

                  {!session && (
                    <div className="mb-10 p-6 border border-nebula-gold/20 bg-nebula-gold/5">
                      <p className="text-sm text-eclipse-silver mb-4">
                        Have an account? <Link href="/login" className="text-nebula-gold underline underline-offset-4">Log in</Link> for a faster experience.
                      </p>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-eclipse-silver">Contact Email (for order updates)</label>
                        <input
                          type="email"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="cosmic@energy.com"
                          className="w-full bg-cosmic-black border border-white/10 rounded-none px-4 py-3 text-sm focus:border-nebula-gold outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <AddressForm
                    onSubmit={handleAddressSubmit}
                    defaultValues={shippingAddress || {}}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="animate-fade-in">
                  <button
                    onClick={() => setStep(1)}
                    className="mb-8 flex items-center gap-2 text-[10px] uppercase tracking-widest text-eclipse-silver hover:text-stardust-white transition-colors"
                  >
                    <ChevronLeft className="h-3 w-3" /> Back to Information
                  </button>
                  <ShippingMethodSelector
                    selectedId={shippingMethod?.id || ""}
                    onSelect={handleShippingSelect}
                    subtotal={subtotal}
                  />
                </div>
              )}

              {step === 3 && shippingAddress && shippingMethod && (
                <div className="animate-fade-in">
                  <button
                    onClick={() => setStep(2)}
                    className="mb-8 flex items-center gap-2 text-[10px] uppercase tracking-widest text-eclipse-silver hover:text-stardust-white transition-colors"
                  >
                    <ChevronLeft className="h-3 w-3" /> Back to Shipping
                  </button>
                  <OrderReviewStep
                    items={items}
                    shippingAddress={shippingAddress}
                    shippingMethod={shippingMethod}
                    subtotal={subtotal}
                    discount={discount}
                    tax={tax}
                    total={total}
                  />

                  <div className="mt-12">
                    <RazorpayButton
                      amount={total}
                      orderData={{
                        items: items.map(i => ({
                          productVariantId: i.id, // Assuming cart item id is variantId or we need to fix it
                          quantity: i.quantity
                        })),
                        shippingAddress,
                        shippingMethodId: shippingMethod.id,
                        guestEmail: session ? undefined : guestEmail,
                      }}
                      onSuccess={handlePaymentSuccess}
                    />
                    <p className="mt-6 text-center font-body text-[10px] uppercase tracking-widest text-eclipse-silver">
                      By placing your order, you agree to Vastrayug&apos;s <Link href="/terms" className="underline">Terms of Service</Link>.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Summary (Fixed on Desktop) */}
          <aside className="w-full lg:w-[400px]">
            <div className="sticky top-12 border border-white/10 bg-deep-indigo/20 p-8 backdrop-blur-md">
              <h3 className="mb-8 font-heading text-lg uppercase tracking-widest text-stardust-white border-b border-white/5 pb-4">
                Order Summary
              </h3>

              <div className="max-h-64 overflow-y-auto no-scrollbar space-y-4 mb-8">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative aspect-[3/4] w-12 flex-shrink-0 bg-deep-indigo/30">
                      {item.image && <Image src={item.image} alt={item.title} fill className="object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-heading text-stardust-white truncate">{item.title}</h4>
                      <p className="text-[10px] text-eclipse-silver uppercase mt-0.5">Qty: {item.quantity} • {item.variant?.size}</p>
                    </div>
                    <span className="text-xs font-body text-stardust-white">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-white/10 pt-6">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-eclipse-silver uppercase tracking-widest">Subtotal</span>
                  <span className="text-stardust-white">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-eclipse-silver uppercase tracking-widest">Shipping</span>
                  <span className="text-stardust-white">
                    {shippingMethod ? (shippingMethod.price === 0 ? "FREE" : formatCurrency(shippingMethod.price)) : "Calculated next"}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-body border-t border-white/5 pt-4">
                  <span className="text-stardust-white font-bold uppercase tracking-widest">Total</span>
                  <span className="text-nebula-gold text-lg font-heading">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center gap-4 border-t border-white/5 pt-6">
                <div className="flex flex-col items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-surya-gold" />
                  <span className="text-[8px] uppercase tracking-tighter text-eclipse-silver whitespace-nowrap">Premium Quality</span>
                </div>
                <div className="h-8 w-[1px] bg-white/5" />
                <div className="flex flex-col items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-chandra-pearl" />
                  <span className="text-[8px] uppercase tracking-tighter text-eclipse-silver whitespace-nowrap">Secure Payments</span>
                </div>
                <div className="h-8 w-[1px] bg-white/5" />
                <div className="flex flex-col items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-nebula-gold" />
                  <span className="text-[8px] uppercase tracking-tighter text-eclipse-silver whitespace-nowrap">Cosmic Alignment</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
