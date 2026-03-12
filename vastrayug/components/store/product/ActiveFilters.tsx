"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ActiveFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: { key: string; value: string; label: string }[] = [];

  // Parse filters from URL
  searchParams.forEach((value, key) => {
    if (["category", "size", "colour", "planet", "zodiac", "lifepath"].includes(key)) {
      value.split(",").forEach((val) => {
        filters.push({
          key,
          value: val,
          label: val.charAt(0).toUpperCase() + val.slice(1).replace("-", " "),
        });
      });
    }
  });

  // Handle price range separately
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  if (minPrice || maxPrice) {
    filters.push({
      key: "price",
      value: "price",
      label: `Price: ₹${minPrice || 0} - ₹${maxPrice || "10k+"}`,
    });
  }

  const removeFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (key === "price") {
      params.delete("minPrice");
      params.delete("maxPrice");
    } else {
      const currentValues = params.get(key)?.split(",") || [];
      const newValues = currentValues.filter((v) => v !== value);

      if (newValues.length > 0) {
        params.set(key, newValues.join(","));
      } else {
        params.delete(key);
      }
    }

    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAll = () => {
    router.push(pathname, { scroll: false });
  };

  if (filters.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <span className="mr-2 font-body text-xs uppercase tracking-widest text-eclipse-silver">
        Active Filters:
      </span>
      {filters.map((filter) => (
        <button
          key={`${filter.key}-${filter.value}`}
          onClick={() => removeFilter(filter.key, filter.value)}
          className="group flex items-center gap-1.5 border border-nebula-gold/30 bg-nebula-gold/5 px-3 py-1.5 transition-colors hover:border-nebula-gold"
        >
          <span className="font-body text-[10px] font-medium uppercase tracking-wider text-stardust-white">
            {filter.label}
          </span>
          <X className="h-3 w-3 text-nebula-gold group-hover:text-stardust-white" />
        </button>
      ))}
      <button
        onClick={clearAll}
        className="ml-2 font-body text-[10px] uppercase tracking-widest text-eclipse-silver hover:text-stardust-white underline underline-offset-4"
      >
        Clear All
      </button>
    </div>
  );
}
