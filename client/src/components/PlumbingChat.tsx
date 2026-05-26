import { useRef, useState, useEffect } from "react";
import { loadProfile } from "@/lib/profileStorage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Upload, Trash2, MessageCircle, User, BarChart3, Briefcase, FileText } from "lucide-react";
import { ClientInfoPage } from "@/pages/ClientInfoPage";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";
import { RegionSelector } from "./RegionSelector";
import { ReportModal } from "./ReportModal";
import { CostEstimateCard } from "./CostEstimateCard";
import { findCostEstimates } from "@/lib/costDatabase";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  imageUrl?: string;
  timestamp: Date;
}

export default function PlumbingChat() {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [showClientInfo, setShowClientInfo] = useState(false);
  const [profileName, setProfileName] = useState("Profile");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const askQuestionMutation = trpc.plumbing.askQuestion.useMutation();
  const analyzeImageMutation = trpc.plumbing.analyzeImage.useMutation();
  const uploadImageMutation = trpc.plumbing.uploadImage.useMutation();
  const historyQuery = trpc.plumbing.getHistory.useQuery();

  // Extract uploaded images for report generation
  const uploadedImages = messages
    .filter((m) => m.type === "user" && m.imageUrl)
    .map((m) => m.imageUrl!)
    .filter((url) => url.startsWith("data:"));

  // Check if we have enough messages to show report button
  const canGenerateReport = messages.length >= 2;

  // Load profile name on mount
  useEffect(() => {
    try {
      const profile = loadProfile();
      if (profile && profile.fullName) {
        setProfileName(`Hi, ${profile.fullName}`);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  }, [showClientInfo]);

  // Load history on mount
  useEffect(() => {
    if (historyQuery.data) {
      const combined: Message[] = [];
      historyQuery.data.forEach((item) => {
        if (item.queryText) {
          combined.push({
            id: `user-${item.id}`,
            type: "user",
            content: item.queryText,
            imageUrl: item.imageUrl || undefined,
            timestamp: item.createdAt,
          });
        }
        combined.push({
          id: `response-${item.id}`,
          type: "assistant",
          content: item.response,
          timestamp: item.updatedAt,
        });
      });

      setMessages(combined);
    }
  }, [historyQuery.data]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !selectedImage) return;

    setIsLoading(true);

    try {
      if (selectedImage) {
        // Read file and convert to base64
        const reader = new FileReader();
        reader.onload = async () => {
          const base64String = (reader.result as string).split(",")[1];
          
          // Upload image
          const uploadResponse = await uploadImageMutation.mutateAsync({
            base64: base64String,
            fileName: selectedImage.name,
          });

          // Add user message with image
          const userMessage: Message = {
            id: Date.now().toString(),
            type: "user",
            content: input,
            imageUrl: uploadResponse.url,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, userMessage]);

          // Get AI response
          const response = await analyzeImageMutation.mutateAsync({
            imageUrl: uploadResponse.url,
            question: input,
          });

          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: "assistant",
            content: response.response,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);

          setInput("");
          setSelectedImage(null);
          setImagePreview(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
          setIsLoading(false);
        };
        reader.readAsDataURL(selectedImage);
      } else {
        // Text-only query
        const userMessage: Message = {
          id: Date.now().toString(),
          type: "user",
          content: input,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);

        const response = await askQuestionMutation.mutateAsync({
          question: input,
        });

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: response.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        setInput("");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content: "Sorry, there was an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            <MessageCircle className="w-6 h-6" />
            <div>
              <h1 className="text-xl font-bold">Plumbing Expert Assistant</h1>
              <p className="text-sm text-blue-100">Professional guidance for plumbing issues</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <RegionSelector />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/jobs")}
              className="text-white hover:bg-blue-700 gap-2"
            >
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Jobs</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/invoices")}
              className="text-white hover:bg-blue-700 gap-2"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Invoices</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/analytics")}
              className="text-white hover:bg-blue-700 gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowClientInfo(true)}
              className="text-white hover:bg-blue-700 gap-2"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{profileName}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <MessageCircle className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">Welcome to Plumbing Expert Assistant</p>
            <p className="text-sm mt-2">Ask questions about plumbing issues or upload photos for analysis</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-4 ${
                  message.type === "user"
                    ? "bg-blue-600 text-white rounded-3xl rounded-tr-none"
                    : "bg-card text-card-foreground rounded-3xl rounded-tl-none border"
                }`}
              >
                {message.imageUrl && (
                  <img
                    src={message.imageUrl}
                    alt="Uploaded"
                    className="w-full rounded-lg mb-2 max-h-48 object-cover"
                  />
                )}
                {message.type === "assistant" ? (
                  <Streamdown>{message.content}</Streamdown>
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
                {message.type === "assistant" && (
                  <CostEstimateCard estimates={findCostEstimates(message.content)} />
                )}
                <p
                  className={`text-xs mt-2 ${
                    message.type === "user" ? "text-blue-100" : "text-muted-foreground"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </Card>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-card text-card-foreground rounded-3xl rounded-tl-none p-4 border">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <p className="text-sm">Analyzing your question...</p>
              </div>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-background p-4 space-y-3">
        {/* Image Preview */}
        {imagePreview && (
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-24 h-24 rounded-lg object-cover border"
            />
            <button
              onClick={clearImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Fields */}
        <div className="space-y-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) {
                handleSendMessage();
              }
            }}
            placeholder="Ask a plumbing question or describe an issue..."
            className="resize-none min-h-20"
          />

          {/* Report Button - Show when enough messages */}
        {canGenerateReport && (
          <Button
            onClick={() => setIsReportModalOpen(true)}
            disabled={isLoading}
            className="w-full gap-2 bg-orange-500 hover:bg-orange-600 text-white"
          >
            <FileText className="w-4 h-4" />
            Generate Job Report
          </Button>
        )}

        {/* Action Buttons */}
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Photo</span>
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || (!input.trim() && !selectedImage)}
              className="ml-auto gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Analyzing...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-xs text-muted-foreground text-center">
          Ctrl+Enter to send • Professional plumbing guidance • Accurate technical advice
        </p>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        chatMessages={messages.map((m) => ({
          role: m.type,
          content: m.content,
        }))}
        uploadedImages={uploadedImages}
      />

      {/* Client Info Modal */}
      {showClientInfo && (
        <ClientInfoPage onClose={() => setShowClientInfo(false)} />
      )}
    </div>
  );
}
