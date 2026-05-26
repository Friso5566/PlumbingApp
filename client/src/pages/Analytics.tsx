import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, TrendingUp, TrendingDown } from "lucide-react";
import { useLocation } from "wouter";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { generateAnalytics, exportAnalyticsToCSV } from "@/lib/analyticsEngine";

export default function Analytics() {
  const [, setLocation] = useLocation();
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [dateRange, setDateRange] = useState<"week" | "month" | "year" | "all">("month");
  const analytics = useMemo(() => generateAnalytics(), []);

  const handleExportCSV = () => {
    const csv = exportAnalyticsToCSV(analytics);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `plumbing-analytics-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const content = `
PLUMBING COST ANALYTICS REPORT
Generated: ${new Date().toLocaleDateString()}

SUMMARY STATISTICS
Total Estimates: ${analytics.totalEstimates}
Average Cost: R${analytics.averageCost.toLocaleString()}
Median Cost: R${analytics.medianCost.toLocaleString()}
Cost Range: R${analytics.costRange.min.toLocaleString()} - R${analytics.costRange.max.toLocaleString()}

COMPLEXITY BREAKDOWN
Low: ${analytics.byComplexity.Low.count} repairs, Avg: R${analytics.byComplexity.Low.avgCost.toLocaleString()}
Medium: ${analytics.byComplexity.Medium.count} repairs, Avg: R${analytics.byComplexity.Medium.avgCost.toLocaleString()}
High: ${analytics.byComplexity.High.count} repairs, Avg: R${analytics.byComplexity.High.avgCost.toLocaleString()}

DIY VS PROFESSIONAL
DIY Friendly: ${analytics.diyVsProfessional.diyCount} (${analytics.diyVsProfessional.diyPercentage}%), Avg: R${analytics.diyVsProfessional.avgDIYCost.toLocaleString()}
Professional: ${analytics.diyVsProfessional.professionalCount}, Avg: R${analytics.diyVsProfessional.avgProfessionalCost.toLocaleString()}
    `;
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `plumbing-analytics-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
  const regions = ["all", "South Africa", "Nigeria", "Kenya", "Universal"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Cost Analytics Dashboard</h1>
              <p className="text-blue-100">Professional plumbing repair insights</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleExportCSV} className="gap-2 bg-white text-blue-600 hover:bg-blue-50">
              <Download className="w-4 h-4" />
              CSV
            </Button>
            <Button onClick={handleExportPDF} className="gap-2 bg-white text-blue-600 hover:bg-blue-50">
              <Download className="w-4 h-4" />
              Report
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto p-6 pb-0">
        <Card className="p-4 bg-white mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region === "all" ? "All Regions" : region}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as "week" | "month" | "year" | "all")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
                <option value="all">All Time</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSelectedRegion("all");
                  setDateRange("month");
                }}
                variant="outline"
                className="w-full"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 bg-white border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 font-medium">Total Estimates</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.totalEstimates}</p>
          </Card>

          <Card className="p-6 bg-white border-l-4 border-green-500">
            <p className="text-sm text-gray-600 font-medium">Average Cost</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">R{analytics.averageCost.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Median: R{analytics.medianCost.toLocaleString()}</p>
          </Card>

          <Card className="p-6 bg-white border-l-4 border-purple-500">
            <p className="text-sm text-gray-600 font-medium">DIY Friendly</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.diyVsProfessional.diyPercentage}%</p>
            <p className="text-xs text-gray-500 mt-1">{analytics.diyVsProfessional.diyCount} repairs</p>
          </Card>

          <Card className="p-6 bg-white border-l-4 border-orange-500">
            <p className="text-sm text-gray-600 font-medium">Cost Range</p>
            <p className="text-lg font-bold text-gray-900 mt-2">
              R{analytics.costRange.min.toLocaleString()} - R{analytics.costRange.max.toLocaleString()}
            </p>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Complexity Distribution */}
          <Card className="p-6 bg-white">
            <h2 className="text-lg font-bold text-gray-900 mb-4">By Complexity Level</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries(analytics.byComplexity).map(([level, data]) => ({
                name: level,
                count: data.count,
                avgCost: data.avgCost,
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="count" fill="#3b82f6" name="Count" />
                <Bar yAxisId="right" dataKey="avgCost" fill="#10b981" name="Avg Cost (R)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* DIY vs Professional */}
          <Card className="p-6 bg-white">
            <h2 className="text-lg font-bold text-gray-900 mb-4">DIY vs Professional</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "DIY Friendly", value: analytics.diyVsProfessional.diyCount },
                    { name: "Professional Required", value: analytics.diyVsProfessional.professionalCount },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Cost Distribution */}
          <Card className="p-6 bg-white">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Cost Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.costDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" name="Number of Repairs" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Trending Issues */}
          <Card className="p-6 bg-white">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Trending Repairs</h2>
            <div className="space-y-3">
              {analytics.trendingIssues.map((issue, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{issue.issue}</p>
                    <p className="text-sm text-gray-600">R{issue.avgCost.toLocaleString()} avg</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{issue.count} repairs</span>
                    {issue.trend === "up" ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : issue.trend === "down" ? (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    ) : (
                      <div className="w-5 h-5 text-gray-400">—</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Regional Breakdown */}
        <Card className="p-6 bg-white">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Regional Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Region</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Estimates</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Average Cost</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Top Issues</th>
                </tr>
              </thead>
              <tbody>
                {analytics.regionalBreakdown.map((region, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{region.region}</td>
                    <td className="text-center py-3 px-4 text-gray-600">{region.estimateCount}</td>
                    <td className="text-center py-3 px-4 font-semibold text-blue-600">
                      R{region.avgCost.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {region.topIssues.slice(0, 2).join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Cost Comparison */}
        <Card className="p-6 bg-white">
          <h2 className="text-lg font-bold text-gray-900 mb-4">DIY vs Professional Cost Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                {
                  name: "DIY Friendly",
                  cost: analytics.diyVsProfessional.avgDIYCost,
                  count: analytics.diyVsProfessional.diyCount,
                },
                {
                  name: "Professional",
                  cost: analytics.diyVsProfessional.avgProfessionalCost,
                  count: analytics.diyVsProfessional.professionalCount,
                },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="cost" fill="#3b82f6" name="Average Cost (R)" />
              <Bar yAxisId="right" dataKey="count" fill="#10b981" name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Footer Info */}
        <div className="text-center text-sm text-gray-600 py-4">
          <p>
            Data filtered by: {selectedRegion === "all" ? "All Regions" : selectedRegion} • Last{" "}
            {dateRange === "week" ? "Week" : dateRange === "month" ? "Month" : dateRange === "year" ? "Year" : "All Time"}
          </p>
        </div>
      </div>
    </div>
  );
}
