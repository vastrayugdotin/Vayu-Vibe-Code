"use client";

import * as React from "react";
import Script from "next/script";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { pushEcommerceEvent, pushPixelEvent } from "@/lib/datalayer";

interface RazorpayButtonProps {
  amount: number;
  orderData: any;
  onSuccess: (response: any) => void;
  disabled?: boolean;
}

export default function RazorpayButton({
  amount,
  orderData,
  onSuccess,
  disabled,
}: RazorpayButtonProps) {
  const [isPending, setIsPending] = React.useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    try {
      setIsPending(true);

      // 1. Create order on server
      const res = await fetch("/api/storefront/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create order");
      }

      const { razorpayOrderId, orderNumber } = data.data;

      // 4.9e: Fire add_payment_info DataLayer event
      pushEcommerceEvent("add_payment_info", {
        currency: "INR",
        value: amount,
        payment_type: "Razorpay",
        items: orderData.items.map((i: any) => ({
          item_id: i.productId,
          quantity: i.quantity,
        })),
      });

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(amount * 100), // in paise
        currency: "INR",
        name: "Vastrayug",
        description: `Order #${orderNumber}`,
        image: "/brand/logo.png",
        order_id: razorpayOrderId,
        handler: function (response: any) {
          onSuccess({
            ...response,
            orderNumber,
          });
        },
        prefill: {
          name: orderData.shippingAddress.name,
          email: orderData.guestEmail || "",
          contact: orderData.shippingAddress.phone,
        },
        theme: {
          color: "#C9A84C",
          backdrop_color: "#0A0A0F",
        },
        modal: {
          ondismiss: function () {
            setIsPending(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Something went wrong with the payment initiation.");
      setIsPending(false);
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <Button
        onClick={handlePayment}
        disabled={disabled || isPending}
        className="group h-16 w-full bg-stardust-white font-bold uppercase tracking-[0.2em] text-cosmic-black hover:bg-nebula-gold transition-all"
      >
        {isPending ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <>
            <span>Pay & Complete Order</span>
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>
    </>
  );
}
