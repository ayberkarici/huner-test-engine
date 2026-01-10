"use client";

import React, { useState, useCallback } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  FileJson,
  FileText,
  Loader2,
  Play,
  RefreshCw,
  Server,
  Sparkles,
  Terminal,
  XCircle,
  Zap,
  Pill,
  Shield,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  ExternalLink,
  HelpCircle,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, estimateTokens, formatLatency, formatTimestamp } from "@/lib/utils";
import { sampleMedicalReport, mockExtractedData, mockSUTEvaluation, SUT_MANAGEMENT_URL } from "@/lib/mock-data";

// Types
interface ExtractedData {
  title: string;
  reportInformation?: {
    reportNo?: string;
    reportDate?: string;
    protocolNo?: string;
    reportType?: string;
    facility?: {
      code?: string;
      title?: string;
    };
  };
  patient?: {
    demographic?: {
      gender?: string;
      dateOfBirth?: string;
      age?: number;
    };
    diagnoses?: Array<{
      code: string;
      title: string;
      description?: string;
      startDate?: string;
      endDate?: string;
    }>;
  };
  medicationInformation?: Array<{
    activeIngredient: string;
    sgkCode?: string;
    brandName?: string;
    form?: string;
    dose?: string;
    usage?: {
      frequency?: string;
      amount?: string;
    };
    addedTime?: string;
  }>;
  doctors?: Array<{
    fullName: string;
    specialty?: string;
    diplomaNo?: string;
    registrationNo?: string;
  }>;
  findings?: Array<{
    type: string;
    value: string;
    description?: string;
    date?: string;
  }>;
  notes?: {
    clinicalSummary?: string;
    dosageDetails?: string;
    allergies?: string;
    contraindications?: string;
    sideEffects?: string;
    monitoring?: string;
    lifestyle?: string;
    emergencyInstructions?: string;
    additionalComments?: string;
  };
}

interface SUTMedication {
  id: string;
  sgkCode: string;
  activeIngredient: string;
  result: "Uygun" | "Uygun Değil" | "Bulunamadı";
  evaluation: string;
  diagnosisCode?: string;
  specialty?: string;
  sutReference?: string;
}

interface SUTEvaluation {
  medications: SUTMedication[];
  overallResult: "Uygun" | "Uygun Değil";
  summary: string;
  timestamp?: string;
}

interface TelemetryLog {
  id: string;
  timestamp: Date;
  type: "request" | "response" | "error";
  payload: unknown;
  latency?: number;
}

interface TokenUsage {
  input: number;
  output: number;
  total: number;
}

interface FeedbackState {
  [medicationId: string]: {
    isCorrect: boolean | null;
    comment: string;
  };
}

// Mock fetch function
async function mockFetch(
  inputText: string
): Promise<{ extractedData: ExtractedData; sutEvaluation: SUTEvaluation; latency: number }> {
  // Simulate network latency (800-2000ms)
  const latency = Math.floor(Math.random() * 1200) + 800;
  await new Promise((resolve) => setTimeout(resolve, latency));

  // Simulate occasional errors (5% chance)
  if (Math.random() < 0.05) {
    throw new Error("API rate limit exceeded. Please try again later.");
  }

  return {
    extractedData: mockExtractedData as ExtractedData,
    sutEvaluation: mockSUTEvaluation as SUTEvaluation,
    latency,
  };
}

// JSON Syntax Highlighter Component
function JsonHighlighter({ json, className }: { json: unknown; className?: string }) {
  const formatValue = (value: unknown, indent: number = 0): React.ReactNode => {
    const indentStr = "  ".repeat(indent);
    const nextIndent = indent + 1;

    if (value === null) {
      return <span className="null">null</span>;
    }

    if (typeof value === "boolean") {
      return <span className="boolean">{value.toString()}</span>;
    }

    if (typeof value === "number") {
      return <span className="number">{value}</span>;
    }

    if (typeof value === "string") {
      return <span className="string">&quot;{value}&quot;</span>;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="bracket">[]</span>;
      }
      return (
        <>
          <span className="bracket">[</span>
          {"\n"}
          {value.map((item, i) => (
            <React.Fragment key={i}>
              {"  ".repeat(nextIndent)}
              {formatValue(item, nextIndent)}
              {i < value.length - 1 ? "," : ""}
              {"\n"}
            </React.Fragment>
          ))}
          {indentStr}
          <span className="bracket">]</span>
        </>
      );
    }

    if (typeof value === "object") {
      const entries = Object.entries(value);
      if (entries.length === 0) {
        return <span className="bracket">{"{}"}</span>;
      }
      return (
        <>
          <span className="bracket">{"{"}</span>
          {"\n"}
          {entries.map(([key, val], i) => (
            <React.Fragment key={key}>
              {"  ".repeat(nextIndent)}
              <span className="key">&quot;{key}&quot;</span>
              {": "}
              {formatValue(val, nextIndent)}
              {i < entries.length - 1 ? "," : ""}
              {"\n"}
            </React.Fragment>
          ))}
          {indentStr}
          <span className="bracket">{"}"}</span>
        </>
      );
    }

    return String(value);
  };

  return (
    <pre className={cn("code-block text-sm overflow-auto", className)}>
      {formatValue(json)}
    </pre>
  );
}

// Skeleton loaders
function ExtractedDataSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/5" />
      <div className="pt-4 space-y-2">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

function SUTEvaluationSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2].map((i) => (
        <div key={i} className="p-4 rounded-lg border bg-card/50 space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      ))}
    </div>
  );
}

// SUT Evaluation Card Component with Feedback
function SUTEvaluationCard({
  medication,
  feedback,
  onFeedback,
}: {
  medication: SUTMedication;
  feedback: { isCorrect: boolean | null; comment: string };
  onFeedback: (isCorrect: boolean | null, comment: string) => void;
}) {
  const [showComment, setShowComment] = useState(false);
  const [localComment, setLocalComment] = useState(feedback.comment);

  const isUygun = medication.result === "Uygun";
  const isBulunamadi = medication.result === "Bulunamadı";

  // Get card styling based on result
  const getCardStyle = () => {
    if (isBulunamadi) return "border-warning/30 bg-warning/5";
    if (isUygun) return "border-success/30 bg-success/5";
    return "border-destructive/30 bg-destructive/5";
  };

  const getBarColor = () => {
    if (isBulunamadi) return "bg-warning";
    if (isUygun) return "bg-success";
    return "bg-destructive";
  };

  const getIconBgColor = () => {
    if (isBulunamadi) return "bg-warning/20 text-warning";
    if (isUygun) return "bg-success/20 text-success";
    return "bg-destructive/20 text-destructive";
  };

  const getBadgeVariant = () => {
    if (isBulunamadi) return "warning" as const;
    if (isUygun) return "success" as const;
    return "destructive" as const;
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300",
      getCardStyle()
    )}>
      {/* Status indicator bar */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1",
        getBarColor()
      )} />
      
      <CardHeader className="pb-3 pt-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg font-mono text-sm font-bold",
              getIconBgColor()
            )}>
              {isBulunamadi ? (
                <HelpCircle className="h-6 w-6" />
              ) : (
                <Pill className="h-6 w-6" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg font-bold tracking-wide">
                {medication.sgkCode}
              </CardTitle>
              <CardDescription className="text-sm">
                {medication.activeIngredient}
              </CardDescription>
            </div>
          </div>
          <Badge
            variant={getBadgeVariant()}
            className="text-sm px-3 py-1 gap-1.5"
          >
            {isBulunamadi ? (
              <HelpCircle className="h-4 w-4" />
            ) : isUygun ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            {medication.result}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Evaluation text */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wide">
            <MessageSquare className="h-3 w-3" />
            Değerlendirme
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">
            {medication.evaluation}
          </p>
        </div>

        {/* Not Found - Add Ingredient Link */}
        {isBulunamadi && (
          <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
            <div className="flex items-start gap-3">
              <PlusCircle className="h-5 w-5 text-warning mt-0.5 shrink-0" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-warning">
                  Etken madde sistemde bulunamadı
                </p>
                <p className="text-xs text-muted-foreground">
                  Bu etken maddeyi SUT veritabanına eklemek için aşağıdaki bağlantıyı kullanın.
                </p>
                <a
                  href={SUT_MANAGEMENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Etken Madde Ekle
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Meta info */}
        {(medication.diagnosisCode || medication.specialty || medication.sutReference) && (
          <div className="flex flex-wrap gap-2 pt-1">
            {medication.diagnosisCode && (
              <Badge variant="outline" className="text-xs">
                Tanı: {medication.diagnosisCode}
              </Badge>
            )}
            {medication.specialty && (
              <Badge variant="outline" className="text-xs">
                {medication.specialty}
              </Badge>
            )}
            {medication.sutReference && (
              <Badge variant="secondary" className="text-xs">
                📋 {medication.sutReference}
              </Badge>
            )}
          </div>
        )}

        {!isBulunamadi && (
          <>
            <Separator className="my-3" />

            {/* Feedback section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Bu değerlendirme doğru mu?
                </span>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={feedback.isCorrect === true ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "h-9 w-9 p-0 transition-all",
                      feedback.isCorrect === true && "bg-success hover:bg-success/90 text-success-foreground"
                    )}
                    onClick={() => onFeedback(feedback.isCorrect === true ? null : true, localComment)}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Doğru</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={feedback.isCorrect === false ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "h-9 w-9 p-0 transition-all",
                      feedback.isCorrect === false && "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    )}
                    onClick={() => {
                      onFeedback(feedback.isCorrect === false ? null : false, localComment);
                      if (feedback.isCorrect !== false) setShowComment(true);
                    }}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Yanlış</TooltipContent>
              </Tooltip>

              {feedback.isCorrect !== null && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 text-xs"
                  onClick={() => setShowComment(!showComment)}
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Yorum
                </Button>
              )}
            </div>
          </div>

          {/* Feedback status indicator */}
          {feedback.isCorrect !== null && (
            <div className={cn(
              "flex items-center gap-2 text-xs px-3 py-2 rounded-md",
              feedback.isCorrect 
                ? "bg-success/10 text-success" 
                : "bg-destructive/10 text-destructive"
            )}>
              {feedback.isCorrect ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  Doğru olarak işaretlendi
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3" />
                  Yanlış olarak işaretlendi
                </>
              )}
            </div>
          )}

              {/* Comment input */}
              {showComment && (
                <div className="space-y-2 animate-fade-in">
                  <Textarea
                    placeholder="Yorumunuzu buraya yazın..."
                    className="min-h-[80px] text-sm bg-muted/30"
                    value={localComment}
                    onChange={(e) => setLocalComment(e.target.value)}
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      onFeedback(feedback.isCorrect, localComment);
                      setShowComment(false);
                    }}
                  >
                    Yorumu Kaydet
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Main Page Component
export default function TestWorkbench() {
  // State
  const [inputText, setInputText] = useState<string>("");
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [sutEvaluation, setSutEvaluation] = useState<SUTEvaluation | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLog[]>([]);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [telemetryOpen, setTelemetryOpen] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FeedbackState>({});

  // Add log entry
  const addLog = useCallback(
    (type: TelemetryLog["type"], payload: unknown, logLatency?: number) => {
      const log: TelemetryLog = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        type,
        payload,
        latency: logLatency,
      };
      setTelemetryLogs((prev) => [log, ...prev].slice(0, 50));
    },
    []
  );

  // Handle feedback update
  const handleFeedback = useCallback((medicationId: string, isCorrect: boolean | null, comment: string) => {
    setFeedback((prev) => ({
      ...prev,
      [medicationId]: { isCorrect, comment },
    }));
  }, []);

  // Process handler
  const handleProcess = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    setError(null);
    setExtractedData(null);
    setSutEvaluation(null);
    setTokenUsage(null);
    setLatency(null);
    setFeedback({});

    const inputTokens = estimateTokens(inputText);

    // Log request
    addLog("request", {
      endpoint: "/api/extract",
      method: "POST",
      body: { text: inputText.slice(0, 200) + "..." },
      inputTokens,
    });

    try {
      const startTime = performance.now();
      const result = await mockFetch(inputText);
      const endTime = performance.now();
      const totalLatency = Math.round(endTime - startTime);

      const outputTokens = estimateTokens(JSON.stringify(result.extractedData));

      setExtractedData(result.extractedData);
      setSutEvaluation(result.sutEvaluation);
      setLatency(totalLatency);
      setTokenUsage({
        input: inputTokens,
        output: outputTokens,
        total: inputTokens + outputTokens,
      });

      // Initialize feedback state for all medications
      const initialFeedback: FeedbackState = {};
      result.sutEvaluation.medications.forEach((med) => {
        initialFeedback[med.id] = { isCorrect: null, comment: "" };
      });
      setFeedback(initialFeedback);

      // Log response
      addLog("response", result, totalLatency);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      addLog("error", { error: errorMessage });
    } finally {
      setIsProcessing(false);
    }
  };

  // Load sample data
  const handleLoadSample = () => {
    setInputText(sampleMedicalReport);
  };

  // Copy JSON
  const handleCopyJson = async () => {
    if (!extractedData) return;
    await navigator.clipboard.writeText(JSON.stringify(extractedData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Reset
  const handleReset = () => {
    setInputText("");
    setExtractedData(null);
    setSutEvaluation(null);
    setError(null);
    setTokenUsage(null);
    setLatency(null);
    setFeedback({});
  };

  return (
    <div className="min-h-screen bg-background dot-pattern">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-emerald-500 glow">
                <Sparkles className="h-5 w-5 text-background" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">Hüner AI</h1>
                <p className="text-xs text-muted-foreground">Test Workbench v1.0</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Activity className="h-3 w-3" />
                <span>SUT Compliance</span>
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Server className="h-3 w-3" />
                <span>Mock Mode</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Top Row: Input + JSON Extraction (2 columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section A: Input */}
          <Card className="border-gradient">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Kaynak Metin</CardTitle>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLoadSample}
                      className="text-xs"
                    >
                      <FileJson className="h-3 w-3 mr-1" />
                      Örnek Yükle
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Örnek tıbbi rapor yükle</TooltipContent>
                </Tooltip>
              </div>
              <CardDescription>
                Ham tıbbi rapor metnini yapıştırın
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Tıbbi rapor metnini buraya yapıştırın..."
                className="min-h-[350px] font-mono text-sm bg-muted/30"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  className="flex-1 gap-2"
                  onClick={handleProcess}
                  disabled={!inputText.trim() || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      İşleniyor...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      İşle
                    </>
                  )}
                </Button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleReset}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Sıfırla</TooltipContent>
                </Tooltip>
              </div>
              {inputText && (
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{inputText.length} karakter</span>
                  <span>~{estimateTokens(inputText)} token</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section B: Extracted JSON */}
          <Card className="border-gradient">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileJson className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Yapılandırılmış Veri</CardTitle>
                </div>
                {extractedData && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyJson}
                    className="text-xs gap-1"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 text-success" />
                        Kopyalandı
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        JSON Kopyala
                      </>
                    )}
                  </Button>
                )}
              </div>
              <CardDescription>AI çıkarım sonucu (JSON Schema)</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] rounded-md border bg-muted/20 p-4">
                {isProcessing ? (
                  <ExtractedDataSkeleton />
                ) : error ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <XCircle className="h-12 w-12 text-destructive mb-3" />
                    <p className="text-sm text-destructive font-medium">Hata Oluştu</p>
                    <p className="text-xs text-muted-foreground mt-1">{error}</p>
                  </div>
                ) : extractedData ? (
                  <JsonHighlighter json={extractedData} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <FileJson className="h-12 w-12 text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Veri bekleniyor...
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      Sol panele metin girin ve &quot;İşle&quot; butonuna tıklayın
                    </p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Section C: SUT Evaluation - Full Width */}
        <div className="mt-6">
          <Card className="border-gradient">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">SUT Değerlendirmesi</CardTitle>
                </div>
                {sutEvaluation && (
                  <Badge
                    variant={sutEvaluation.overallResult === "Uygun" ? "success" : "destructive"}
                    className="text-sm px-4 py-1.5 gap-1.5"
                  >
                    {sutEvaluation.overallResult === "Uygun" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    GENEL SONUÇ: {sutEvaluation.overallResult.toUpperCase()}
                  </Badge>
                )}
              </div>
              <CardDescription>
                Sağlık Uygulama Tebliği uyumluluk analizi ve geri bildirim
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isProcessing ? (
                <SUTEvaluationSkeleton />
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertTriangle className="h-12 w-12 text-warning mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Değerlendirme yapılamadı
                  </p>
                </div>
              ) : sutEvaluation ? (
                <div className="space-y-6">
                  {/* Summary */}
                  {sutEvaluation.summary && (
                    <div className={cn(
                      "p-4 rounded-lg border",
                      sutEvaluation.overallResult === "Uygun"
                        ? "bg-success/5 border-success/20"
                        : "bg-destructive/5 border-destructive/20"
                    )}>
                      <p className="text-sm text-foreground/80">
                        {sutEvaluation.summary}
                      </p>
                    </div>
                  )}

                  {/* Medication Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sutEvaluation.medications.map((med) => (
                      <SUTEvaluationCard
                        key={med.id}
                        medication={med}
                        feedback={feedback[med.id] || { isCorrect: null, comment: "" }}
                        onFeedback={(isCorrect, comment) => handleFeedback(med.id, isCorrect, comment)}
                      />
                    ))}
                  </div>

                  {/* Feedback Summary */}
                  {Object.values(feedback).some((f) => f.isCorrect !== null) && (
                    <div className="mt-4 p-4 rounded-lg bg-muted/30 border">
                      <h4 className="text-sm font-medium mb-2">Geri Bildirim Özeti</h4>
                      <div className="flex gap-4 text-sm">
                        <span className="text-success">
                          ✓ Doğru: {Object.values(feedback).filter((f) => f.isCorrect === true).length}
                        </span>
                        <span className="text-destructive">
                          ✗ Yanlış: {Object.values(feedback).filter((f) => f.isCorrect === false).length}
                        </span>
                        <span className="text-muted-foreground">
                          ○ Bekliyor: {Object.values(feedback).filter((f) => f.isCorrect === null).length}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Shield className="h-12 w-12 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Değerlendirme bekleniyor...
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Rapor işlendikten sonra SUT uyumluluk sonuçları burada görüntülenecek
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Telemetry Panel */}
        <div className="mt-6">
          <Card className="border-gradient overflow-hidden">
            <button
              onClick={() => setTelemetryOpen(!telemetryOpen)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                <span className="font-semibold">Telemetri Paneli</span>
                <Badge variant="secondary" className="ml-2">
                  Developer Console
                </Badge>
              </div>
              {telemetryOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>

            {telemetryOpen && (
              <div className="border-t">
                {/* Metrics Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/20">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                    <div className="p-2 rounded-md bg-primary/10">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Gecikme</p>
                      <p className="text-lg font-mono font-bold">
                        {latency !== null ? formatLatency(latency) : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                    <div className="p-2 rounded-md bg-emerald-500/10">
                      <ArrowRight className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Giriş Token</p>
                      <p className="text-lg font-mono font-bold">
                        {tokenUsage?.input ?? "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                    <div className="p-2 rounded-md bg-amber-500/10">
                      <ArrowRight className="h-4 w-4 text-amber-500 rotate-180" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Çıkış Token</p>
                      <p className="text-lg font-mono font-bold">
                        {tokenUsage?.output ?? "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                    <div className="p-2 rounded-md bg-violet-500/10">
                      <Zap className="h-4 w-4 text-violet-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Toplam Token</p>
                      <p className="text-lg font-mono font-bold">
                        {tokenUsage?.total ?? "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Logs */}
                <div className="p-4">
                  <Tabs defaultValue="logs" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="logs" className="gap-1">
                        <Terminal className="h-3 w-3" />
                        API Logları
                      </TabsTrigger>
                      <TabsTrigger value="request" className="gap-1">
                        <ArrowRight className="h-3 w-3" />
                        Son İstek
                      </TabsTrigger>
                      <TabsTrigger value="response" className="gap-1">
                        <FileJson className="h-3 w-3" />
                        Son Yanıt
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="logs">
                      <ScrollArea className="h-[200px] rounded-md border bg-muted/20">
                        {telemetryLogs.length === 0 ? (
                          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                            Henüz log kaydı yok
                          </div>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[120px]">Zaman</TableHead>
                                <TableHead className="w-[100px]">Tür</TableHead>
                                <TableHead className="w-[100px]">Gecikme</TableHead>
                                <TableHead>Detay</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {telemetryLogs.map((log) => (
                                <TableRow key={log.id}>
                                  <TableCell className="font-mono text-xs">
                                    {formatTimestamp(log.timestamp)}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={
                                        log.type === "error"
                                          ? "destructive"
                                          : log.type === "request"
                                          ? "outline"
                                          : "success"
                                      }
                                      className="text-xs"
                                    >
                                      {log.type === "request"
                                        ? "REQ"
                                        : log.type === "response"
                                        ? "RES"
                                        : "ERR"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="font-mono text-xs">
                                    {log.latency ? `${log.latency}ms` : "—"}
                                  </TableCell>
                                  <TableCell className="font-mono text-xs text-muted-foreground truncate max-w-[300px]">
                                    {JSON.stringify(log.payload).slice(0, 100)}...
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="request">
                      <ScrollArea className="h-[200px] rounded-md border bg-muted/20 p-4">
                        {telemetryLogs.find((l) => l.type === "request") ? (
                          <JsonHighlighter
                            json={telemetryLogs.find((l) => l.type === "request")?.payload}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                            Henüz istek yok
                          </div>
                        )}
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="response">
                      <ScrollArea className="h-[200px] rounded-md border bg-muted/20 p-4">
                        {telemetryLogs.find((l) => l.type === "response") ? (
                          <JsonHighlighter
                            json={telemetryLogs.find((l) => l.type === "response")?.payload}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                            Henüz yanıt yok
                          </div>
                        )}
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-8">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>© 2024 Hüner AI — Tıbbi Rapor İşleme Motoru</span>
            <span className="flex items-center gap-1">
              <Activity className="h-3 w-3 text-success" />
              Sistem Aktif
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
