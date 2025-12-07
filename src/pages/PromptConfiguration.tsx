import { useState } from "react";
import { MessageSquareCode, Save, GitCompare, Upload, Sparkles, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { HierarchySelector } from "@/components/shared/HierarchySelector";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { promptVersions } from "@/lib/mockData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Selection {
  moduleId: string | null;
  consignorId: string | null;
  transporterId: string | null;
}

const fewShotExamples = [
  {
    id: 1,
    document: "BOL-2024-001.pdf",
    input: "Bill of Lading with sender: ACME Corp, receiver: Global Retail",
    output: '{"sender": {"name": "ACME Corp"}, "receiver": {"name": "Global Retail"}}',
  },
  {
    id: 2,
    document: "Invoice-2024-045.pdf",
    input: "Commercial invoice with 5 line items totaling $12,500",
    output: '{"items": [...], "total": 12500, "currency": "USD"}',
  },
];

export default function PromptConfiguration() {
  const [selection, setSelection] = useState<Selection>({
    moduleId: null,
    consignorId: null,
    transporterId: null,
  });
  const [selectedVersion, setSelectedVersion] = useState("3");
  const [prompt, setPrompt] = useState(promptVersions[2].prompt);
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleVersionChange = (version: string) => {
    setSelectedVersion(version);
    const versionData = promptVersions.find((v) => v.version.toString() === version);
    if (versionData) {
      setPrompt(versionData.prompt);
    }
  };

  const handleSave = () => {
    toast({
      title: "Prompt Saved",
      description: "Your prompt has been saved as a new version.",
    });
  };

  const handleSaveAsNew = () => {
    toast({
      title: "New Version Created",
      description: `Version ${parseInt(selectedVersion) + 1} has been created.`,
    });
  };

  // Approximate token count (very rough)
  const tokenCount = Math.ceil(prompt.length / 4);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Prompt Configuration</h1>
        <p className="text-muted-foreground">
          Manage OCR extraction prompts and few-shot examples.
        </p>
      </div>

      {/* Hierarchy Selector */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquareCode className="h-5 w-5 text-primary" />
            Select Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HierarchySelector onSelectionChange={setSelection} />
        </CardContent>
      </Card>

      {selection.moduleId && (
        <>
          {/* Prompt Editor */}
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Prompt Editor</CardTitle>
                  <CardDescription>Edit the extraction prompt for this configuration</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={selectedVersion} onValueChange={handleVersionChange}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Version" />
                    </SelectTrigger>
                    <SelectContent>
                      {promptVersions.map((v) => (
                        <SelectItem key={v.version} value={v.version.toString()}>
                          v{v.version} - {v.date}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Dialog open={compareDialogOpen} onOpenChange={setCompareDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <GitCompare className="h-4 w-4 mr-2" />
                        Compare
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Compare Versions</DialogTitle>
                        <DialogDescription>
                          Side-by-side comparison of prompt versions
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4 py-4">
                        <div>
                          <Label className="mb-2 block">Version 2</Label>
                          <div className="p-4 bg-muted/50 rounded-lg border border-border text-sm">
                            {promptVersions[1].prompt}
                          </div>
                        </div>
                        <div>
                          <Label className="mb-2 block">Version 3</Label>
                          <div className="p-4 bg-muted/50 rounded-lg border border-border text-sm">
                            {promptVersions[2].prompt}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-48 font-mono text-sm"
                  placeholder="Enter your OCR extraction prompt..."
                />
                <div className="absolute bottom-3 right-3 text-xs text-muted-foreground bg-background px-2 py-1 rounded border border-border">
                  ~{tokenCount} tokens
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground">Model:</Label>
                    <Select defaultValue="gpt-4">
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude">Claude 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleSaveAsNew}>
                    Save as New Version
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Few-Shot Examples */}
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-warning" />
                    Few-Shot Examples
                  </CardTitle>
                  <CardDescription>
                    Provide sample documents with expected outputs to improve extraction accuracy
                  </CardDescription>
                </div>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Add Example
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="examples" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="examples">Examples ({fewShotExamples.length})</TabsTrigger>
                  <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
                </TabsList>

                <TabsContent value="examples" className="space-y-4">
                  {fewShotExamples.map((example) => (
                    <div
                      key={example.id}
                      className="p-4 rounded-lg border border-border bg-muted/30"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <StatusBadge status="success">{example.document}</StatusBadge>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">
                            Input Description
                          </Label>
                          <p className="text-sm">{example.input}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">
                            Expected Output
                          </Label>
                          <pre className="text-xs font-mono bg-muted p-2 rounded overflow-x-auto">
                            {example.output}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="guidelines">
                  <div className="p-4 bg-info/10 rounded-lg border border-info/20">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-info shrink-0 mt-0.5" />
                      <div className="space-y-2 text-sm">
                        <p className="font-medium text-foreground">Few-Shot Example Best Practices:</p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>Include 2-5 diverse examples covering different document layouts</li>
                          <li>Ensure examples represent edge cases and variations</li>
                          <li>Keep expected outputs consistent in structure</li>
                          <li>Update examples when document formats change</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}

      {/* No Selection State */}
      {!selection.moduleId && (
        <Card className="shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquareCode className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Select a Configuration</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Choose a module, consignor, and optionally a transporter to edit prompts
              for that configuration level.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
