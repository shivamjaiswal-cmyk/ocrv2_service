import { useState } from "react";
import { Table2, Wand2, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { HierarchySelector } from "@/components/shared/HierarchySelector";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { JsonViewer } from "@/components/shared/JsonViewer";
import { standardFields, fieldMappings, sampleOcrOutput } from "@/lib/mockData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";

interface Selection {
  moduleId: string | null;
  consignorId: string | null;
  transporterId: string | null;
}

const transforms = [
  { value: "none", label: "None" },
  { value: "trim", label: "Trim Whitespace" },
  { value: "uppercase", label: "Uppercase" },
  { value: "lowercase", label: "Lowercase" },
  { value: "number", label: "Parse Number" },
  { value: "date", label: "Parse Date" },
];

export default function FieldMapping() {
  const [selection, setSelection] = useState<Selection>({
    moduleId: null,
    consignorId: null,
    transporterId: null,
  });
  const [showPreview, setShowPreview] = useState(true);
  const [mappings, setMappings] = useState(
    standardFields.map((field) => {
      const existingMapping = fieldMappings.find((m) => m.fieldId === field.id);
      return {
        ...field,
        jsonPath: existingMapping?.jsonPath || "",
        transform: existingMapping?.transform || "none",
        confidence: existingMapping?.confidence || null,
      };
    })
  );
  const { toast } = useToast();

  const handleAutoMap = () => {
    toast({
      title: "AI Mapping Complete",
      description: "8 fields were automatically mapped with high confidence.",
    });
  };

  const updateMapping = (fieldId: string, key: string, value: string | boolean) => {
    setMappings((prev) =>
      prev.map((m) => (m.id === fieldId ? { ...m, [key]: value } : m))
    );
  };

  const getMappedPaths = () => {
    return mappings.filter((m) => m.jsonPath).map((m) => m.jsonPath.replace(/\$\./g, "$."));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Field Mapping</h1>
        <p className="text-muted-foreground">
          Map OCR JSON output fields to your standard payload structure.
        </p>
      </div>

      {/* Hierarchy Selector */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Table2 className="h-5 w-5 text-primary" />
            Select Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HierarchySelector onSelectionChange={setSelection} />
        </CardContent>
      </Card>

      {selection.moduleId && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Mapping Table */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Field Mappings</CardTitle>
                    <CardDescription>
                      Configure how OCR output maps to standard fields
                    </CardDescription>
                  </div>
                  <Button onClick={handleAutoMap}>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Auto-map using AI
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[180px]">Field</TableHead>
                        <TableHead>JSON Path</TableHead>
                        <TableHead className="w-[140px]">Transform</TableHead>
                        <TableHead className="w-[100px] text-center">Required</TableHead>
                        <TableHead className="w-[80px] text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mappings.map((field) => (
                        <TableRow key={field.id}>
                          <TableCell>
                            <div>
                              <span className="font-medium">{field.name}</span>
                              <div className="text-xs text-muted-foreground">{field.type}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={field.jsonPath}
                              onChange={(e) =>
                                updateMapping(field.id, "jsonPath", e.target.value)
                              }
                              placeholder="$.path.to.field"
                              className="font-mono text-sm"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={field.transform}
                              onValueChange={(v) => updateMapping(field.id, "transform", v)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {transforms.map((t) => (
                                  <SelectItem key={t.value} value={t.value}>
                                    {t.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={field.mandatory}
                              onCheckedChange={(v) =>
                                updateMapping(field.id, "mandatory", v)
                              }
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {field.jsonPath ? (
                              field.confidence ? (
                                <div className="flex items-center justify-center gap-1">
                                  <CheckCircle2 className="h-4 w-4 text-success" />
                                  <span className="text-xs text-muted-foreground">
                                    {field.confidence}%
                                  </span>
                                </div>
                              ) : (
                                <CheckCircle2 className="h-4 w-4 text-success mx-auto" />
                              )
                            ) : field.mandatory ? (
                              <AlertCircle className="h-4 w-4 text-destructive mx-auto" />
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline">Reset</Button>
                  <Button>Save Mappings</Button>
                </div>
              </CardContent>
            </Card>

            {/* Auto-Detected Suggestions */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Auto-Detected Suggestions</CardTitle>
                <CardDescription>
                  AI-powered suggestions for unmapped fields
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mappings
                    .filter((m) => !m.jsonPath && m.mandatory)
                    .slice(0, 3)
                    .map((field) => (
                      <div
                        key={field.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20"
                      >
                        <div>
                          <span className="font-medium">{field.name}</span>
                          <StatusBadge status="warning" className="ml-2">
                            Unmapped
                          </StatusBadge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select>
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Suggested paths..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="$.document.id">
                                $.document.id (92%)
                              </SelectItem>
                              <SelectItem value="$.tracking.ref">
                                $.tracking.ref (85%)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="sm">Apply</Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* JSON Preview Panel */}
          <div className="lg:col-span-1">
            <Collapsible open={showPreview} onOpenChange={setShowPreview}>
              <Card className="shadow-soft sticky top-20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">JSON Preview</CardTitle>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        {showPreview ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CardDescription>Sample OCR output with mapped paths</CardDescription>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <JsonViewer
                      data={sampleOcrOutput}
                      highlightPaths={getMappedPaths()}
                      className="max-h-[600px]"
                    />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>
        </div>
      )}

      {/* No Selection State */}
      {!selection.moduleId && (
        <Card className="shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Table2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Select a Configuration</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Choose a module to configure field mappings between OCR output and your
              standard payload structure.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
