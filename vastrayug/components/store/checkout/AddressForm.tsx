"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type AddressInput } from "@/lib/validations/checkout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { cn } from "@/lib/utils";

interface AddressFormProps {
  onSubmit: (data: AddressInput) => void;
  defaultValues?: Partial<AddressInput>;
  isLoading?: boolean;
  savedAddresses?: AddressInput[];
}

export default function AddressForm({
  onSubmit,
  defaultValues,
  isLoading,
  savedAddresses = [],
}: AddressFormProps) {
  const [selectedAddressIndex, setSelectedAddressIndex] = React.useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: "IN",
      ...defaultValues,
    },
  });

  const handleSelectSavedAddress = (index: number) => {
    setSelectedAddressIndex(index);
    reset(savedAddresses[index]);
  };

  const handleAddNewAddress = () => {
    setSelectedAddressIndex(null);
    reset({
      country: "IN",
      name: "",
      phone: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      isDefault: false,
    });
  };

  return (
    <div className="space-y-8">
      {savedAddresses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-stardust-white">
            Saved Addresses
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {savedAddresses.map((address, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectSavedAddress(index)}
                className={cn(
                  "flex flex-col items-start border p-4 text-left transition-colors",
                  selectedAddressIndex === index
                    ? "border-nebula-gold bg-nebula-gold/10"
                    : "border-white/10 hover:border-white/30"
                )}
              >
                <div className="flex w-full items-center justify-between mb-2">
                  <span className="font-bold text-stardust-white">{address.name}</span>
                  {address.isDefault && (
                    <span className="text-[10px] uppercase tracking-wider text-nebula-gold bg-nebula-gold/20 px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>
                <div className="text-xs text-eclipse-silver space-y-1">
                  <p>{address.line1}</p>
                  {address.line2 && <p>{address.line2}</p>}
                  <p>
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p className="pt-2 flex items-center gap-1">
                    <span className="text-stardust-white/50">📞</span> +91 {address.phone}
                  </p>
                </div>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddNewAddress}
            className={cn(
              "text-xs font-bold uppercase tracking-widest transition-colors",
              selectedAddressIndex !== null ? "text-nebula-gold" : "text-stardust-white hidden"
            )}
          >
            + Add New Address
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-eclipse-silver">
            Full Name
          </label>
          <Input
            {...register("name")}
            placeholder="Arjun Sharma"
            className={errors.name ? "border-mangal-red" : ""}
          />
          {errors.name && (
            <p className="text-[10px] text-mangal-red uppercase">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-eclipse-silver">
            Mobile Number
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-eclipse-silver">+91</span>
            <Input
              {...register("phone")}
              placeholder="9876543210"
              className={cn("pl-12", errors.phone ? "border-mangal-red" : "")}
            />
          </div>
          {errors.phone && (
            <p className="text-[10px] text-mangal-red uppercase">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-eclipse-silver">
          Address Line 1 (House No, Building, Street)
        </label>
        <Input
          {...register("line1")}
          placeholder="123, Cosmic Towers"
          className={errors.line1 ? "border-mangal-red" : ""}
        />
        {errors.line1 && (
          <p className="text-[10px] text-mangal-red uppercase">{errors.line1.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-eclipse-silver">
          Address Line 2 (Landmark, Area)
        </label>
        <Input
          {...register("line2")}
          placeholder="Near Nebula Park"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-eclipse-silver">
            City
          </label>
          <Input
            {...register("city")}
            placeholder="Mumbai"
            className={errors.city ? "border-mangal-red" : ""}
          />
          {errors.city && (
            <p className="text-[10px] text-mangal-red uppercase">{errors.city.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-eclipse-silver">
            State
          </label>
          <Input
            {...register("state")}
            placeholder="Maharashtra"
            className={errors.state ? "border-mangal-red" : ""}
          />
          {errors.state && (
            <p className="text-[10px] text-mangal-red uppercase">{errors.state.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-eclipse-silver">
            PIN Code
          </label>
          <Input
            {...register("postalCode")}
            placeholder="400001"
            className={errors.postalCode ? "border-mangal-red" : ""}
          />
          {errors.postalCode && (
            <p className="text-[10px] text-mangal-red uppercase">{errors.postalCode.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3 pt-2">
        <Checkbox
          id="isDefault"
          checked={watch("isDefault")}
          onCheckedChange={(checked) => setValue("isDefault", !!checked)}
        />
        <label
          htmlFor="isDefault"
          className="text-xs font-medium uppercase tracking-widest text-eclipse-silver cursor-pointer"
        >
          Save as default address
        </label>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-stardust-white text-cosmic-black h-14 font-bold uppercase tracking-[0.2em] hover:bg-nebula-gold"
      >
        {isLoading ? "Saving..." : "Deliver to this address"}
      </Button>
      </form>
    </div>
  );
}

