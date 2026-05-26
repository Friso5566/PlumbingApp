import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";

export interface FilterOptions {
  complexity: ("Low" | "Medium" | "High")[];
  diyFriendly: boolean | null;
  priceRange: [number, number];
  searchTerm: string;
  sortBy: "price-low" | "price-high" | "complexity" | "diy-friendly";
}

interface EstimateFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  maxPrice?: number;
}

export function EstimateFilter({ onFilterChange, maxPrice = 10000 }: EstimateFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    complexity: [],
    diyFriendly: null,
    priceRange: [0, maxPrice],
    searchTerm: "",
    sortBy: "price-low",
  });

  const handleComplexityChange = (level: "Low" | "Medium" | "High") => {
    const newComplexity = filters.complexity.includes(level)
      ? filters.complexity.filter((c) => c !== level)
      : [...filters.complexity, level];
    const updatedFilters = { ...filters, complexity: newComplexity };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleDiyChange = (value: boolean | null) => {
    const updatedFilters = { ...filters, diyFriendly: filters.diyFriendly === value ? null : value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handlePriceChange = (value: number[]) => {
    const updatedFilters = { ...filters, priceRange: [value[0], value[1]] as [number, number] };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFilters = { ...filters, searchTerm: e.target.value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleSortChange = (sortBy: FilterOptions["sortBy"]) => {
    const updatedFilters = { ...filters, sortBy };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      complexity: [],
      diyFriendly: null,
      priceRange: [0, maxPrice],
      searchTerm: "",
      sortBy: "price-low",
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const activeFilterCount = [
    filters.complexity.length,
    filters.diyFriendly !== null ? 1 : 0,
    filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0,
    filters.searchTerm ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <Card className="w-full bg-card border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <span className="font-semibold">Advanced Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">{activeFilterCount}</span>
          )}
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Search */}
          <div>
            <label className="text-sm font-medium">Search Parts</label>
            <Input
              placeholder="Search for specific parts or issues..."
              value={filters.searchTerm}
              onChange={handleSearchChange}
              className="mt-2"
            />
          </div>

          {/* Complexity Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Complexity Level</label>
            <div className="space-y-2">
              {(["Low", "Medium", "High"] as const).map((level) => (
                <div key={level} className="flex items-center gap-2">
                  <Checkbox
                    checked={filters.complexity.includes(level)}
                    onCheckedChange={() => handleComplexityChange(level)}
                    id={`complexity-${level}`}
                  />
                  <label htmlFor={`complexity-${level}`} className="text-sm cursor-pointer">
                    {level} Complexity
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* DIY Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">DIY Friendly</label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={filters.diyFriendly === true}
                  onCheckedChange={() => handleDiyChange(true)}
                  id="diy-yes"
                />
                <label htmlFor="diy-yes" className="text-sm cursor-pointer">
                  DIY Friendly Only
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={filters.diyFriendly === false}
                  onCheckedChange={() => handleDiyChange(false)}
                  id="diy-no"
                />
                <label htmlFor="diy-no" className="text-sm cursor-pointer">
                  Professional Required
                </label>
              </div>
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Price Range: R{filters.priceRange[0]} - R{filters.priceRange[1]}
            </label>
            <Slider
              min={0}
              max={maxPrice}
              step={100}
              value={filters.priceRange}
              onValueChange={handlePriceChange}
              className="w-full"
            />
          </div>

          {/* Sort Options */}
          <div>
            <label className="text-sm font-medium mb-2 block">Sort By</label>
            <div className="space-y-2">
              {[
                { value: "price-low", label: "Price: Low to High" },
                { value: "price-high", label: "Price: High to Low" },
                { value: "complexity", label: "Complexity" },
                { value: "diy-friendly", label: "DIY Friendly First" },
              ].map(({ value, label }) => (
                <Button
                  key={value}
                  variant={filters.sortBy === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSortChange(value as FilterOptions["sortBy"])}
                  className="w-full justify-start"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          {activeFilterCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleReset} className="w-full gap-2">
              <X className="w-4 h-4" />
              Reset Filters
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
