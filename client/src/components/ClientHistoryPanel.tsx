import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, TrendingUp, DollarSign, Briefcase, Calendar } from "lucide-react";
import { ClientProfile, getClientStatistics, getRepeatClientBadge, getRepeatClientBadgeColor } from "@/lib/repeatClientDetection";

interface ClientHistoryPanelProps {
  clientProfile: ClientProfile;
  onViewFullHistory?: () => void;
  onQuickRepeat?: () => void;
  compact?: boolean;
}

export function ClientHistoryPanel({
  clientProfile,
  onViewFullHistory,
  onQuickRepeat,
  compact = false,
}: ClientHistoryPanelProps) {
  const statistics = getClientStatistics(clientProfile);
  const badge = getRepeatClientBadge(clientProfile);
  const badgeColor = getRepeatClientBadgeColor(clientProfile.repeatClientScore);

  if (compact) {
    return (
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-sm">{clientProfile.name}</h3>
              {badge && (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${badgeColor}`}>{badge}</span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-gray-600">Jobs</p>
                <p className="font-bold text-lg text-blue-600">{clientProfile.totalJobs}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Spent</p>
                <p className="font-bold text-green-600">R{clientProfile.totalSpent.toFixed(0)}</p>
              </div>
              <div>
                <p className="text-gray-600">Avg Value</p>
                <p className="font-bold text-purple-600">R{clientProfile.averageJobValue.toFixed(0)}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {onQuickRepeat && (
              <Button size="sm" variant="outline" onClick={onQuickRepeat} className="text-xs">
                Quick Repeat
              </Button>
            )}
            {onViewFullHistory && (
              <Button size="sm" variant="ghost" onClick={onViewFullHistory} className="text-xs">
                <ChevronRight className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Badge */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{clientProfile.name}</h2>
          {badge && (
            <div className={`inline-block text-sm font-medium px-3 py-1 rounded-full mt-2 ${badgeColor}`}>
              {badge}
            </div>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Repeat Client Score</p>
          <p className="text-3xl font-bold text-blue-600">{clientProfile.repeatClientScore}/100</p>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold">{clientProfile.totalJobs}</p>
            </div>
            <Briefcase className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold">R{clientProfile.totalSpent.toFixed(0)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Job Value</p>
              <p className="text-2xl font-bold">R{clientProfile.averageJobValue.toFixed(0)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Last Job</p>
              <p className="text-sm font-bold">
                {clientProfile.lastJobDate ? formatDaysAgo(clientProfile.lastJobDate) : "N/A"}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-orange-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Detailed Statistics Table */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Client Details</h3>
        <div className="space-y-3">
          {statistics.map((stat, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
              <span className="text-sm text-gray-600">{stat.label}</span>
              <span className="font-medium">{stat.value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Job Types */}
      {clientProfile.jobTypes.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Service History</h3>
          <div className="flex flex-wrap gap-2">
            {clientProfile.jobTypes.map((type) => (
              <span key={type} className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                {type.replace("-", " ")}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Invoices */}
      {clientProfile.invoices.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Recent Invoices</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {clientProfile.invoices.slice(-5).map((invoice) => (
              <div key={invoice.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <div>
                  <p className="font-medium text-sm">{invoice.invoiceNumber}</p>
                  <p className="text-xs text-gray-600">{new Date(invoice.invoiceDate).toLocaleDateString("en-ZA")}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">R{invoice.total.toFixed(2)}</p>
                  <p className="text-xs text-gray-600 capitalize">{invoice.status}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {onQuickRepeat && (
          <Button onClick={onQuickRepeat} className="flex-1 bg-blue-500 hover:bg-blue-600">
            Create Similar Job
          </Button>
        )}
        {onViewFullHistory && (
          <Button onClick={onViewFullHistory} variant="outline" className="flex-1">
            View Full History
          </Button>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> This client has been with you for{" "}
          {clientProfile.firstJobDate ? getDaysSince(clientProfile.firstJobDate) : "a while"}. Consider offering loyalty
          discounts or priority service!
        </p>
      </div>
    </div>
  );
}

function formatDaysAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;

  return `${Math.floor(days / 365)} years ago`;
}

function getDaysSince(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (days < 30) return `${days} days`;
  if (days < 365) return `${Math.floor(days / 30)} months`;

  return `${Math.floor(days / 365)} years`;
}
