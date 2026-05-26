import { ArrowLeft, MessageSquare, Image as ImageIcon, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";
import { useLocation } from "wouter";

export default function SimpleProfile() {
  const [, setLocation] = useLocation();
  const historyQuery = trpc.plumbing.getHistory.useQuery();

  const recentQueries = historyQuery.data ? historyQuery.data.slice(0, 20) : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/")}
            className="hover:bg-blue-700 p-2 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Recent Queries</h1>
            <p className="text-sm text-blue-100">Your chat history</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {historyQuery.isLoading ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Loading your chat history...</p>
          </Card>
        ) : recentQueries.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-muted-foreground">No queries yet. Start by asking a question!</p>
          </Card>
        ) : (
          recentQueries.map((item) => (
            <Card key={item.id} className="p-4 border-l-4 border-l-blue-500">
              {/* Meta info */}
              <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                {item.queryType === "image" ? (
                  <ImageIcon className="w-4 h-4 text-purple-600" />
                ) : (
                  <MessageSquare className="w-4 h-4 text-green-600" />
                )}
                <Calendar className="w-3 h-3" />
                <span>{new Date(item.createdAt).toLocaleString()}</span>
              </div>

              {/* Image if present */}
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt="Query"
                  className="w-full rounded-lg mb-3 max-h-40 object-cover"
                />
              )}

              {/* Query */}
              {item.queryText && (
                <div className="mb-3 p-2 bg-blue-50 rounded text-sm">
                  <p className="font-medium text-blue-900">Q: {item.queryText}</p>
                </div>
              )}

              {/* Response */}
              <div className="p-2 bg-gray-50 rounded text-sm">
                <p className="font-medium text-gray-900 mb-1">A:</p>
                <div className="text-gray-800 line-clamp-4">
                  <Streamdown>{item.response}</Streamdown>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
