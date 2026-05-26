import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";
import { motion } from "framer-motion";

interface CostEstimate {
  id: string;
  issue: string;
  partsMin: number;
  partsMax: number;
  labourMin: number;
  labourMax: number;
  complexity: "Low" | "Medium" | "High";
  diy: boolean;
  parts: string[];
}

interface EstimateComparisonProps {
  estimates: CostEstimate[];
  onRemove: (id: string) => void;
  onExport: () => void;
}

export function EstimateComparison({ estimates, onRemove, onExport }: EstimateComparisonProps) {
  if (estimates.length === 0) return null;

  const complexityOrder = { Low: 1, Medium: 2, High: 3 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full mb-4"
    >
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-purple-900">Comparison View ({estimates.length})</h3>
          <Button variant="outline" size="sm" onClick={onExport} className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-purple-200">
                <th className="text-left py-2 px-2 font-semibold">Issue</th>
                <th className="text-center py-2 px-2 font-semibold">Parts Cost</th>
                <th className="text-center py-2 px-2 font-semibold">Labour Cost</th>
                <th className="text-center py-2 px-2 font-semibold">Total</th>
                <th className="text-center py-2 px-2 font-semibold">Complexity</th>
                <th className="text-center py-2 px-2 font-semibold">DIY</th>
                <th className="text-center py-2 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {estimates
                .sort((a, b) => complexityOrder[a.complexity] - complexityOrder[b.complexity])
                .map((estimate) => {
                  const totalMin = estimate.partsMin + estimate.labourMin;
                  const totalMax = estimate.partsMax + estimate.labourMax;
                  const avgTotal = Math.round((totalMin + totalMax) / 2);

                  return (
                    <tr key={estimate.id} className="border-b border-purple-100 hover:bg-purple-100/30">
                      <td className="py-3 px-2 font-medium">{estimate.issue}</td>
                      <td className="text-center py-3 px-2">
                        R{estimate.partsMin.toLocaleString()} - R{estimate.partsMax.toLocaleString()}
                      </td>
                      <td className="text-center py-3 px-2">
                        R{estimate.labourMin.toLocaleString()} - R{estimate.labourMax.toLocaleString()}
                      </td>
                      <td className="text-center py-3 px-2 font-bold text-purple-600">
                        R{avgTotal.toLocaleString()}
                      </td>
                      <td className="text-center py-3 px-2">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            estimate.complexity === "Low"
                              ? "bg-green-100 text-green-800"
                              : estimate.complexity === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {estimate.complexity}
                        </span>
                      </td>
                      <td className="text-center py-3 px-2">{estimate.diy ? "✓" : "✗"}</td>
                      <td className="text-center py-3 px-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemove(estimate.id)}
                          className="hover:bg-red-100 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-purple-200 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-purple-600 font-medium">Total Estimates</p>
            <p className="text-2xl font-bold text-purple-900">{estimates.length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-purple-600 font-medium">Average Cost</p>
            <p className="text-2xl font-bold text-purple-900">
              R
              {Math.round(
                estimates.reduce((sum, e) => sum + (e.partsMin + e.labourMin + e.partsMax + e.labourMax) / 2, 0) /
                  estimates.length
              ).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-purple-600 font-medium">DIY Friendly</p>
            <p className="text-2xl font-bold text-purple-900">{estimates.filter((e) => e.diy).length}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
