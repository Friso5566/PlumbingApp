import { useState } from "react";
import { ChevronDown, ChevronUp, Wrench, AlertCircle, CheckCircle } from "lucide-react";
import { CostEstimate, calculateRuralPricing } from "@/lib/costDatabase";

interface CostEstimateCardProps {
  estimates: CostEstimate[];
  onAddToQuote?: (estimates: CostEstimate[]) => void;
}

export function CostEstimateCard({ estimates, onAddToQuote }: CostEstimateCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [region, setRegion] = useState<"metro" | "rural">("metro");

  if (!estimates || estimates.length === 0) return null;

  // Calculate combined estimates
  let totalPartsMin = 0,
    totalPartsMax = 0,
    totalLabourMin = 0,
    totalLabourMax = 0;
  let maxComplexity: "Low" | "Medium" | "High" = "Low";
  let anyDiy = false;

  const allParts: Array<{ name: string; minPrice: number; maxPrice: number; estimate: CostEstimate }> = [];

  estimates.forEach((est) => {
    const pricing = region === "rural" ? calculateRuralPricing(est) : est;

    totalPartsMin += pricing.partsMin;
    totalPartsMax += pricing.partsMax;
    totalLabourMin += pricing.labourMin;
    totalLabourMax += pricing.labourMax;

    // Track max complexity
    const complexityOrder = { Low: 0, Medium: 1, High: 2 };
    if (complexityOrder[est.complexity] > complexityOrder[maxComplexity]) {
      maxComplexity = est.complexity;
    }

    if (est.diy) anyDiy = true;

    est.parts.forEach((part) => {
      allParts.push({
        name: part.name,
        minPrice: region === "rural" ? Math.round(part.minPrice * 1.2) : part.minPrice,
        maxPrice: region === "rural" ? Math.round(part.maxPrice * 1.2) : part.maxPrice,
        estimate: est,
      });
    });
  });

  const totalMin = totalPartsMin + totalLabourMin;
  const totalMax = totalPartsMax + totalLabourMax;

  const complexityColor = {
    Low: "bg-green-100 text-green-800",
    Medium: "bg-amber-100 text-amber-800",
    High: "bg-red-100 text-red-800",
  };

  const suppliers = [
    { name: "Builders Warehouse", url: "https://www.builders.co.za" },
    { name: "Plumblink", url: "https://www.plumblink.co.za" },
    { name: "Leroy Merlin", url: "https://www.leroymerlin.co.za" },
    { name: "Alert Steel", url: "https://www.alertsteel.co.za" },
  ];

  return (
    <div className="my-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Estimated Cost (South Africa)</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-blue-100 rounded transition"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Region Toggle */}
      <div className="flex gap-2 mb-3 text-sm">
        <button
          onClick={() => setRegion("metro")}
          className={`px-3 py-1 rounded-full transition ${
            region === "metro"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
          }`}
        >
          🏙️ Metro
        </button>
        <button
          onClick={() => setRegion("rural")}
          className={`px-3 py-1 rounded-full transition ${
            region === "rural"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
          }`}
        >
          🌾 Rural
        </button>
      </div>

      {/* Total Range - Always Visible */}
      <div className="mb-3 p-3 bg-white rounded border border-blue-100">
        <p className="text-xs text-gray-600 mb-1">Total Estimated Range</p>
        <p className="text-2xl font-bold text-blue-900">
          R{totalMin.toLocaleString()} – R{totalMax.toLocaleString()}
        </p>
        <div className="flex gap-2 mt-2 text-xs">
          <span className="text-gray-600">
            Parts: <span className="font-semibold">R{totalPartsMin.toLocaleString()} – R{totalPartsMax.toLocaleString()}</span>
          </span>
          <span className="text-gray-600">
            Labour: <span className="font-semibold">R{totalLabourMin.toLocaleString()} – R{totalLabourMax.toLocaleString()}</span>
          </span>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="space-y-3 border-t border-blue-200 pt-3">
          {/* Parts Breakdown */}
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-2">Parts Breakdown</p>
            <div className="space-y-1 text-sm">
              {allParts.map((part, idx) => (
                <div key={idx} className="flex justify-between text-gray-700">
                  <span>{part.name}</span>
                  <span className="font-medium">
                    R{part.minPrice.toLocaleString()} – R{part.maxPrice.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Complexity & DIY */}
          <div className="flex gap-2 flex-wrap">
            <span className={`px-2 py-1 rounded text-xs font-semibold ${complexityColor[maxComplexity]}`}>
              {maxComplexity} Complexity
            </span>
            {anyDiy ? (
              <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> DIY Possible
              </span>
            ) : (
              <span className="px-2 py-1 rounded text-xs font-semibold bg-orange-100 text-orange-800 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Call a Plumber
              </span>
            )}
          </div>

          {/* Supplier Links */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Where to buy parts:</p>
            <div className="flex gap-2 flex-wrap">
              {suppliers.map((supplier) => (
                <a
                  key={supplier.name}
                  href={supplier.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-white border border-blue-300 rounded-full text-xs text-blue-600 hover:bg-blue-50 transition"
                >
                  {supplier.name}
                </a>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {onAddToQuote && (
              <button
                onClick={() => onAddToQuote(estimates)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition"
              >
                Add to Quote
              </button>
            )}
            <button
              onClick={() => {
                const text = `Estimated Cost for ${estimates.map((e) => e.issue).join(", ")}:\n\nTotal: R${totalMin.toLocaleString()} – R${totalMax.toLocaleString()}\nParts: R${totalPartsMin.toLocaleString()} – R${totalPartsMax.toLocaleString()}\nLabour: R${totalLabourMin.toLocaleString()} – R${totalLabourMax.toLocaleString()}\n\nRegion: ${region === "metro" ? "Metro" : "Rural"}`;
                window.location.href = `mailto:?subject=Plumbing Cost Estimate&body=${encodeURIComponent(text)}`;
              }}
              className="flex-1 px-3 py-2 bg-white border border-blue-300 text-blue-600 rounded text-sm font-medium hover:bg-blue-50 transition"
            >
              Email Estimate
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-600 italic border-t border-blue-200 pt-2">
            Estimates based on average South African market prices (2025). Actual costs may vary by region and supplier.
          </p>
        </div>
      )}
    </div>
  );
}
