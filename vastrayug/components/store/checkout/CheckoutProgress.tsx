"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CheckoutProgressProps {
  currentStep: 1 | 2 | 3;
}

const STEPS = [
  { id: 1, label: "Address" },
  { id: 2, label: "Shipping" },
  { id: 3, label: "Review & Pay" },
];

export default function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex flex-1 items-center last:flex-none">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-300",
                  currentStep >= step.id
                    ? "border-nebula-gold bg-nebula-gold text-cosmic-black"
                    : "border-white/10 bg-transparent text-eclipse-silver"
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-bold">{step.id}</span>
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-[10px] uppercase tracking-widest transition-colors duration-300",
                  currentStep === step.id ? "text-nebula-gold font-bold" : "text-eclipse-silver"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting Line */}
            {index < STEPS.length - 1 && (
              <div className="mx-4 h-[1px] flex-1 bg-white/10">
                <div
                  className={cn(
                    "h-full bg-nebula-gold transition-all duration-500",
                    currentStep > step.id ? "w-full" : "w-0"
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
