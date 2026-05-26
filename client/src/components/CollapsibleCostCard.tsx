import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Star, Copy, Share2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface CostEstimate {
  id: string;
  issue: string;
  keywords: string[];
  partsMin: number;
  partsMax: number;
  labourMin: number;
  labourMax: number;
  complexity: "Low" | "Medium" | "High";
  diy: boolean;
  parts: string[];
  suppliers?: {
    name: string;
    url: string;
  }[];
}

interface CollapsibleCostCardProps {
  estimate: CostEstimate;
  onAddToQuote?: (estimate: CostEstimate) => void;
  isFavorited?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function CollapsibleCostCard({
  estimate,
  onAddToQuote,
  isFavorited = false,
  onToggleFavorite,
}: CollapsibleCostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFav, setIsFav] = useState(isFavorited);

  const totalMin = estimate.partsMin + estimate.labourMin;
  const totalMax = estimate.partsMax + estimate.labourMax;
  const avgCost = Math.round((totalMin + totalMax) / 2);

  const complexityColors = {
    Low: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-red-100 text-red-800",
  };

  const handleCopyEstimate = () => {
    const text = `${estimate.issue}\nParts: R${estimate.partsMin} - R${estimate.partsMax}\nLabour: R${estimate.labourMin} - R${estimate.labourMax}\nTotal: R${totalMin} - R${totalMax}`;
    navigator.clipboard.writeText(text);
    toast.success("Estimate copied to clipboard!");
  };

  const handleToggleFavorite = () => {
    setIsFav(!isFav);
    onToggleFavorite?.(estimate.id);
    toast.success(isFav ? "Removed from favorites" : "Added to favorites");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 overflow-hidden">
        {/* Header - Always Visible */}
        <div
          className="p-4 cursor-pointer hover:bg-blue-100/50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-lg text-gray-900">{estimate.issue}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${complexityColors[estimate.complexity]}`}>
                  {estimate.complexity}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="font-bold text-blue-600">R{avgCost.toLocaleString()}</span>
                <span className="text-gray-600">
                  {estimate.diy ? "✓ DIY Friendly" : "⚠ Professional Required"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavorite();
                }}
                className="hover:bg-yellow-100"
              >
                <Star className={`w-5 h-5 ${isFav ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
              </Button>
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-blue-200 bg-white"
            >
              <div className="p-4 space-y-4">
                {/* Price Breakdown */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-semibold text-sm mb-2">Cost Breakdown</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Parts:</span>
                      <span className="font-medium">R{estimate.partsMin.toLocaleString()} - R{estimate.partsMax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Labour:</span>
                      <span className="font-medium">R{estimate.labourMin.toLocaleString()} - R{estimate.labourMax.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-1 mt-1 flex justify-between font-bold">
                      <span>Total Estimate:</span>
                      <span className="text-blue-600">R{totalMin.toLocaleString()} - R{totalMax.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Parts List */}
                {estimate.parts.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Required Parts</h4>
                    <ul className="space-y-1">
                      {estimate.parts.map((part, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span>{part}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* DIY Warning */}
                {!estimate.diy && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-orange-800">
                      <p className="font-medium">Professional Installation Recommended</p>
                      <p className="text-xs mt-1">This repair requires specialized skills and tools.</p>
                    </div>
                  </div>
                )}

                {/* Suppliers */}
                {estimate.suppliers && estimate.suppliers.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Recommended Suppliers</h4>
                    <div className="space-y-2">
                      {estimate.suppliers.map((supplier, idx) => (
                        <a
                          key={idx}
                          href={supplier.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          → {supplier.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyEstimate}
                    className="flex-1 gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  {onAddToQuote && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onAddToQuote(estimate)}
                      className="flex-1"
                    >
                      Add to Quote
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
