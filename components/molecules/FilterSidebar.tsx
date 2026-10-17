"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";

interface Facet {
  flavor: string;
}

interface FilterSidebarProps {
  facets: Facet[];
  priceRange: { min: number; max: number };
}

export function FilterSidebar({ facets, priceRange }: FilterSidebarProps) {
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState(priceRange.max);

  const toggleFlavor = (flavor: string) => {
    setSelectedFlavors((prev) =>
      prev.includes(flavor) ? prev.filter((f) => f !== flavor) : [...prev, flavor]
    );
  };

  return (
    <aside className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Flavors</h3>
        <div className="space-y-2">
          {facets.map((facet) => (
            <label key={facet.flavor} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFlavors.includes(facet.flavor)}
                onChange={() => toggleFlavor(facet.flavor)}
                className="rounded border-input"
              />
              <span className="text-sm">{facet.flavor}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Price Range</h3>
        <div className="space-y-2">
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${(priceRange.min / 100).toFixed(0)}</span>
            <span>${(priceMax / 100).toFixed(0)}</span>
          </div>
        </div>
      </div>

      <Button
        className="w-full"
        variant="outline"
        onClick={() => {
          setSelectedFlavors([]);
          setPriceMax(priceRange.max);
        }}
      >
        Reset Filters
      </Button>
    </aside>
  );
}
