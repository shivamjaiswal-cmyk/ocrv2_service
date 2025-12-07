import { useState, useCallback } from "react";
import { 
  FlaskConical, 
  Upload, 
  Play, 
  Save, 
  GitCompare, 
  FileText,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { HierarchySelector } from "@/components/shared/HierarchySelector";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { JsonViewer } from "@/components/shared/JsonViewer";
import { sampleOcrOutput, standardFields, fieldMappings } from "@/lib/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Selection {
  moduleId: string | null;
  consignorId: string | null;
  transporterId: string | null;
}

export default function OCRSandbox() {
  const [selection, setSelection] = useState<Selection>({
    moduleId: null,
    consignorId: null,
    transporterId: null,
  });
  const [autoResolve, setAutoResolve] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const { toast } = useToast();

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.type.startsWith("image/"))) {
      setUploadedFile(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleRunOCR = () => {
    if (!uploadedFile) {
      toast({
        title: "No File Selected",
        description: "Please upload a document first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    // Simulate OCR processing
    setTimeout(() => {
      setIsProcessing(false);
      setHasResults(true);
      toast({
        title: "OCR Complete",
        description: "Document processed successfully.",
      });
    }, 2000);
  };

  const handleSavePrompt = () => {
    toast({
      title: "Prompt Saved",
      description: "Current prompt saved to configuration.",
    });
  };

  const handleSaveMappings = () => {
    toast({
      title: "Mappings Saved",
      description: "Field mapping fixes applied to configuration.",
    });
  };

  // Generate mapped output from sample OCR data
  const mappedOutput = standardFields.map((field) => {
    const mapping = fieldMappings.find((m) => m.fieldId === field.id);
    let value = null;
    let status: "mapped" | "unmapped" | "missing" = "unmapped";

    if (mapping) {
      // Simulate extracting value from JSON path
      const pathParts = mapping.jsonPath.replace("$.", "").split(".");
      let current: unknown = sampleOcrOutput;
      for (const part of pathParts) {
        if (current && typeof current === "object" && part in current) {
          current = (current as Record<string, unknown>)[part];
        } else {
          current = null;
          break;
        }
      }
      value = current;
      status = value !== null ? "mapped" : "unmapped";
    } else if (field.mandatory) {
      status = "missing";
    }

    return { ...field, value, status };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">OCR Sandbox</h1>
        <p className="text-muted-foreground">
          Test prompts and mappings with real documents in real-time.
        </p>
      </div>

      {/* Configuration Selection */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-primary" />
                Test Configuration
              </CardTitle>
              <CardDescription>Select or auto-resolve configuration</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="auto-resolve" className="text-sm">Auto Resolve</Label>
              <Switch
                id="auto-resolve"
                checked={autoResolve}
                onCheckedChange={setAutoResolve}
              />
            </div>
          </div>
        </CardHeader>
        {!autoResolve && (
          <CardContent>
            <HierarchySelector onSelectionChange={setSelection} />
          </CardContent>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Document Upload</CardTitle>
              <div className="flex items-center gap-2">
                <Label className="text-sm">Compare Mode</Label>
                <Switch checked={compareMode} onCheckedChange={setCompareMode} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                uploadedFile
                  ? "border-success bg-success/5"
                  : "border-border hover:border-primary/50"
              }`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
            >
              {uploadedFile ? (
                <div className="space-y-2">
                  <FileText className="h-12 w-12 text-success mx-auto" />
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUploadedFile(null)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="font-medium">Drop your document here</p>
                    <p className="text-sm text-muted-foreground">
                      PDF or image files up to 10MB
                    </p>
                  </div>
                  <div>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      className="hidden"
                      id="file-upload"
                      onChange={handleFileSelect}
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" asChild>
                        <span>Browse Files</span>
                      </Button>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                className="flex-1"
                onClick={handleRunOCR}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run OCR Test
                  </>
                )}
              </Button>
              {compareMode && (
                <Button variant="outline">
                  <GitCompare className="h-4 w-4 mr-2" />
                  Compare
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Status */}
        {hasResults && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Extraction Status</CardTitle>
              <CardDescription>Field mapping results summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 rounded-lg bg-success/10 border border-success/20">
                  <CheckCircle2 className="h-6 w-6 text-success mx-auto mb-2" />
                  <div className="text-2xl font-bold text-success">
                    {mappedOutput.filter((f) => f.status === "mapped").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Mapped</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-warning/10 border border-warning/20">
                  <AlertCircle className="h-6 w-6 text-warning mx-auto mb-2" />
                  <div className="text-2xl font-bold text-warning">
                    {mappedOutput.filter((f) => f.status === "unmapped").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Unmapped</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <XCircle className="h-6 w-6 text-destructive mx-auto mb-2" />
                  <div className="text-2xl font-bold text-destructive">
                    {mappedOutput.filter((f) => f.status === "missing").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Missing</div>
                </div>
              </div>

              <div className="space-y-2">
                {mappedOutput
                  .filter((f) => f.status !== "mapped")
                  .slice(0, 4)
                  .map((field) => (
                    <div
                      key={field.id}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        field.status === "missing"
                          ? "bg-destructive/10"
                          : "bg-warning/10"
                      }`}
                    >
                      <span className="text-sm font-medium">{field.name}</span>
                      <StatusBadge
                        status={field.status === "missing" ? "error" : "warning"}
                      >
                        {field.status}
                      </StatusBadge>
                    </div>
                  ))}
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handleSavePrompt}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Prompt
                </Button>
                <Button className="flex-1" onClick={handleSaveMappings}>
                  Save Mapping Fixes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Output Panels */}
      {hasResults && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Extraction Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="raw" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="raw">Raw OCR Output</TabsTrigger>
                <TabsTrigger value="mapped">Mapped Structure</TabsTrigger>
              </TabsList>

              <TabsContent value="raw">
                <JsonViewer data={sampleOcrOutput} />
              </TabsContent>

              <TabsContent value="mapped">
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium">Field</th>
                        <th className="text-left p-3 text-sm font-medium">Value</th>
                        <th className="text-center p-3 text-sm font-medium w-24">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mappedOutput.map((field) => (
                        <tr key={field.id} className="border-t border-border">
                          <td className="p-3">
                            <span className="font-medium">{field.name}</span>
                            {field.mandatory && (
                              <span className="text-destructive ml-1">*</span>
                            )}
                          </td>
                          <td className="p-3 font-mono text-sm">
                            {field.value !== null ? String(field.value) : "—"}
                          </td>
                          <td className="p-3 text-center">
                            {field.status === "mapped" && (
                              <CheckCircle2 className="h-5 w-5 text-success mx-auto" />
                            )}
                            {field.status === "unmapped" && (
                              <AlertCircle className="h-5 w-5 text-warning mx-auto" />
                            )}
                            {field.status === "missing" && (
                              <XCircle className="h-5 w-5 text-destructive mx-auto" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
