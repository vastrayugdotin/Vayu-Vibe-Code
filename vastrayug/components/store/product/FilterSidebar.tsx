"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X, ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Slider } from "@/components/ui/Slider";
import { Input } from "@/components/ui/Input";

// --- Mock Data (Based on PRD Appendix) ---

const CATEGORIES = [
  { label: "Oversized Tees", value: "oversized-tees" },
  { label: "Hoodies", value: "hoodies" },
  { label: "Co-ord Sets", value: "co-ord-sets" },
  { label: "Joggers", value: "joggers" },
  { label: "Jackets", value: "jackets" },
  { label: "Accessories", value: "accessories" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const COLOURS = [
  { name: "Nebula Gold", hex: "#C9A84C", value: "gold" },
  { name: "Deep Red", hex: "#8B0000", value: "red" },
  { name: "Emerald Budh", hex: "#50C878", value: "green" },
  { name: "Royal Yellow", hex: "#FADA5E", value: "yellow" },
  { name: "Midnight Blue", hex: "#191970", value: "blue" },
  { name: "Rose Gold", hex: "#B76E79", value: "pink" },
  { name: "Smoke Grey", hex: "#808080", value: "grey" },
];

const PLANETS = [
  "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"
];

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const LIFE_PATH_NUMBERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "11", "22"];

// --- Components ---

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="border-b border-white/10 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between font-heading text-sm uppercase tracking-widest text-stardust-white"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen ? "rotate-0" : "-rotate-90"
          )}
        />
      </button>
      {isOpen && <div className="mt-4 space-y-3">{children}</div>}
    </div>
  );
}

export default function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  // Sync state with URL params
  const getParamValues = (key: string) => searchParams.get(key)?.split(",") || [];

  const activeCategories = getParamValues("category");
  const activeSizes = getParamValues("size");
  const activeColours = getParamValues("colour");
  const activePlanets = getParamValues("planet");
  const activeZodiac = getParamValues("zodiac");
  const activeLifePath = getParamValues("lifepath");
  const priceRange = [
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 10000,
  ];

  const updateFilters = (key: string, values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (values.length > 0) {
      params.set(key, values.join(","));
    } else {
      params.delete(key);
    }
    // Reset to page 1 on filter change
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const toggleValue = (key: string, value: string, currentValues: string[]) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    updateFilters(key, newValues);
  };

  const handlePriceChange = (values: number[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", values[0].toString());
    params.set("maxPrice", values[1].toString());
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    router.push(pathname, { scroll: false });
    setIsMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col gap-2">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-xl tracking-wide text-stardust-white">Filters</h2>
        {(activeCategories.length > 0 ||
          activeSizes.length > 0 ||
          activeColours.length > 0 ||
          activePlanets.length > 0 ||
          activeZodiac.length > 0 ||
          activeLifePath.length > 0 ||
          searchParams.has("minPrice")) && (
          <button
            onClick={clearFilters}
            className="font-body text-xs uppercase tracking-tighter text-nebula-gold hover:text-stardust-white"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <FilterSection title="Category">
        {CATEGORIES.map((cat) => (
          <div key={cat.value} className="flex items-center space-x-3">
            <Checkbox
              id={`cat-${cat.value}`}
              checked={activeCategories.includes(cat.value)}
              onCheckedChange={() => toggleValue("category", cat.value, activeCategories)}
            />
            <label
              htmlFor={`cat-${cat.value}`}
              className="font-body text-sm text-eclipse-silver hover:text-stardust-white cursor-pointer"
            >
              {cat.label}
            </label>
          </div>
        ))}
      </FilterSection>

      {/* Planets */}
      <FilterSection title="Ruling Planet" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-2">
          {PLANETS.map((planet) => (
            <div key={planet} className="flex items-center space-x-3">
              <Checkbox
                id={`planet-${planet}`}
                checked={activePlanets.includes(planet.toLowerCase())}
                onCheckedChange={() => toggleValue("planet", planet.toLowerCase(), activePlanets)}
              />
              <label
                htmlFor={`planet-${planet}`}
                className="font-body text-xs text-eclipse-silver hover:text-stardust-white cursor-pointer"
              >
                {planet}
              </label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Zodiac Signs */}
      <FilterSection title="Zodiac Sign" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-2">
          {ZODIAC_SIGNS.map((sign) => (
            <div key={sign} className="flex items-center space-x-3">
              <Checkbox
                id={`zodiac-${sign}`}
                checked={activeZodiac.includes(sign.toLowerCase())}
                onCheckedChange={() => toggleValue("zodiac", sign.toLowerCase(), activeZodiac)}
              />
              <label
                htmlFor={`zodiac-${sign}`}
                className="font-body text-xs text-eclipse-silver hover:text-stardust-white cursor-pointer"
              >
                {sign}
              </label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Life Path Numbers */}
      <FilterSection title="Life Path Number" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {LIFE_PATH_NUMBERS.map((num) => (
            <button
              key={num}
              onClick={() => toggleValue("lifepath", num, activeLifePath)}
              className={cn(
                "flex h-8 w-8 items-center justify-center border font-body text-xs transition-colors",
                activeLifePath.includes(num)
                  ? "border-nebula-gold bg-nebula-gold text-cosmic-black"
                  : "border-white/10 text-eclipse-silver hover:border-stardust-white"
              )}
            >
              {num}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Sizes */}
      <FilterSection title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleValue("size", size, activeSizes)}
              className={cn(
                "flex h-9 w-9 items-center justify-center border font-body text-xs transition-colors",
                activeSizes.includes(size)
                  ? "border-nebula-gold bg-nebula-gold text-cosmic-black"
                  : "border-white/10 text-eclipse-silver hover:border-stardust-white"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Colours */}
      <FilterSection title="Colour Swatch">
        <div className="flex flex-wrap gap-3">
          {COLOURS.map((colour) => (
            <button
              key={colour.value}
              onClick={() => toggleValue("colour", colour.value, activeColours)}
              title={colour.name}
              className={cn(
                "h-6 w-6 rounded-full border-2 transition-all",
                activeColours.includes(colour.value)
                  ? "border-stardust-white scale-110"
                  : "border-transparent"
              )}
              style={{ backgroundColor: colour.hex }}
            />
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="px-2 pt-4">
          <Slider
            defaultValue={[0, 10000]}
            max={10000}
            step={100}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="mb-6"
          />
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-eclipse-silver">₹</span>
              <Input
                type="number"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange([Number(e.target.value), priceRange[1]])}
                className="h-8 pl-6 text-xs"
              />
            </div>
            <span className="text-eclipse-silver">—</span>
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-eclipse-silver">₹</span>
              <Input
                type="number"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange([priceRange[0], Number(e.target.value)])}
                className="h-8 pl-6 text-xs"
              />
            </div>
          </div>
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          className="w-full flex items-center justify-between border-white/10 text-stardust-white hover:bg-white/5"
          onClick={() => setIsMobileOpen(true)}
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </span>
          {searchParams.toString() && (
            <span className="ml-2 rounded-full bg-nebula-gold px-2 py-0.5 text-[10px] text-cosmic-black">
              Active
            </span>
          )}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 no-scrollbar">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Overlay Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-cosmic-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Panel */}
          <div className="absolute inset-y-0 left-0 w-4/5 max-w-sm bg-void-black border-r border-white/10 p-6 shadow-2xl overflow-y-auto">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 text-stardust-white hover:text-nebula-gold"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            {sidebarContent}
            <div className="mt-8">
              <Button
                className="w-full bg-nebula-gold text-cosmic-black"
                onClick={() => setIsMobileOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
