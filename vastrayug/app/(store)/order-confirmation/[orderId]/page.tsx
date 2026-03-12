import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Package, Truck, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import OrderConfirmationAnalytics from "@/components/store/checkout/OrderConfirmationAnalytics";

export const metadata: Metadata = {
  title: "Order Confirmed | Vastrayug",
  robots: { index: false, follow: false },
};

interface OrderConfirmationPageProps {
  params: {
    orderId: string;
  };
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                where: { isPrimary: true },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
      <OrderConfirmationAnalytics order={order} />
      <div className="flex flex-col items-center text-center">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-nebula-gold/10 text-nebula-gold shadow-[0_0_30px_rgba(201,168,76,0.2)] animate-pulse">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <span className="mb-2 block font-body text-xs uppercase tracking-[0.3em] text-nebula-gold">
          Alignment Successful
        </span>
        <h1 className="mb-4 font-heading text-4xl text-stardust-white md:text-5xl uppercase tracking-wider">
          Order Confirmed
        </h1>
        <p className="mb-12 max-w-lg font-body text-lg text-eclipse-silver">
          Thank you for choosing Vastrayug. Your cosmic artifacts are being prepared for their journey.
        </p>

        <div className="w-full border border-white/10 bg-deep-indigo/10 p-6 md:p-10 backdrop-blur-sm">
          <div className="mb-10 grid grid-cols-1 gap-8 text-left md:grid-cols-3">
            <div>
              <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-eclipse-silver">Order Number</h3>
              <p className="font-body text-sm font-medium text-stardust-white uppercase">{order.orderNumber}</p>
            </div>
            <div>
              <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-eclipse-silver">Date</h3>
              <p className="font-body text-sm font-medium text-stardust-white">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-eclipse-silver">Payment Status</h3>
              <p className="font-body text-sm font-medium text-budh-emerald uppercase tracking-wider">{order.paymentStatus}</p>
            </div>
          </div>

          <div className="mb-10 border-t border-white/5 pt-10 text-left">
            <h3 className="mb-6 font-heading text-xl uppercase tracking-widest text-stardust-white">Items in Shipment</h3>
            <div className="space-y-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-6">
                  <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden bg-void-black border border-white/5">
                    {item.product.images[0]?.url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.product.images[0].url}
                        alt={item.productTitleSnapshot}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <h4 className="font-heading text-base text-stardust-white">{item.productTitleSnapshot}</h4>
                    <p className="mt-1 font-body text-[10px] uppercase tracking-widest text-eclipse-silver">
                      Qty: {item.quantity} • {(item.variantSnapshot as any)?.size}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="font-body text-sm text-stardust-white">{formatCurrency(Number(item.lineTotal))}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/5 pt-10">
            <div className="ml-auto max-w-xs space-y-4 text-left">
              <div className="flex justify-between font-body text-sm">
                <span className="text-eclipse-silver uppercase tracking-widest">Subtotal</span>
                <span className="text-stardust-white">{formatCurrency(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-eclipse-silver uppercase tracking-widest">Shipping</span>
                <span className="text-stardust-white">{Number(order.shippingCost) === 0 ? "FREE" : formatCurrency(Number(order.shippingCost))}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-4 font-heading text-2xl">
                <span className="text-stardust-white uppercase tracking-widest text-lg">Total</span>
                <span className="text-nebula-gold">{formatCurrency(Number(order.total))}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col sm:flex-row gap-6">
          <Link href="/shop">
            <Button className="h-14 bg-stardust-white px-10 font-bold uppercase tracking-[0.2em] text-cosmic-black hover:bg-nebula-gold transition-colors">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/account/orders">
            <Button variant="outline" className="h-14 border-white/10 px-10 font-semibold uppercase tracking-[0.2em] text-stardust-white hover:bg-white/5 transition-colors">
              Track Order
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
