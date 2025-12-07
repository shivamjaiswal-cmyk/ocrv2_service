import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { FilterBar } from "@/components/workspace/FilterBar";
import { PromptEditor } from "@/components/workspace/PromptEditor";
import { SandboxUpload } from "@/components/workspace/SandboxUpload";
import { OcrJsonViewer } from "@/components/workspace/OcrJsonViewer";
import { MappingTable, FieldMapping } from "@/components/workspace/MappingTable";
import { UnmappedFieldsPanel } from "@/components/workspace/UnmappedFieldsPanel";
import { SaveConfigModal } from "@/components/workspace/SaveConfigModal";
import { configs, defaultPrompt, sampleOcrOutput, standardFields } from "@/lib/mockData";
import { Save, Copy, Sparkles } from "lucide-react";

export default function ConfigWorkspace() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Filter state
  const [moduleId, setModuleId] = useState(searchParams.get("module") || "");
  const [consignorId, setConsignorId] = useState(searchParams.get("consignor") || "");
  const [transporterId, setTransporterId] = useState(searchParams.get("transporter") || "");
  const [configLoaded, setConfigLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Workspace state
  const [prompt, setPrompt] = useState("");
  const [isDefaultPrompt, setIsDefaultPrompt] = useState(true);
  const [mappings, setMappings] = useState<Record<string, FieldMapping>>({});
  const [ocrOutput, setOcrOutput] = useState<Record<string, unknown> | null>(null);
  const [isRunningOcr, setIsRunningOcr] = useState(false);
  const [applyToOthers, setApplyToOthers] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);

  // Load config from URL params on mount
  useEffect(() => {
    if (searchParams.get("module") && searchParams.get("consignor")) {
      handleLoadConfig();
    }
  }, []);

  const handleModuleChange = (value: string) => {
    setModuleId(value);
    setConsignorId("");
    setTransporterId("");
    setConfigLoaded(false);
  };

  const handleConsignorChange = (value: string) => {
    setConsignorId(value);
    setTransporterId("");
    setConfigLoaded(false);
  };

  const handleTransporterChange = (value: string) => {
    setTransporterId(value === "all" ? "" : value);
    setConfigLoaded(false);
  };

  const handleLoadConfig = () => {
    setIsLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      // Find existing config
      const existingConfig = configs.find(
        (c) =>
          c.moduleId === moduleId &&
          c.consignorId === consignorId &&
          (transporterId ? c.transporterId === transporterId : c.transporterId === null)
      );

      if (existingConfig) {
        setPrompt(existingConfig.prompt);
        setIsDefaultPrompt(!existingConfig.hasCustomPrompt);
        setMappings(existingConfig.mappings);
        toast({
          title: "Config Loaded",
          description: "Existing configuration has been loaded.",
        });
      } else {
        // New config mode
        setPrompt(defaultPrompt);
        setIsDefaultPrompt(true);
        // Initialize with default mandatory values
        const defaultMappings: Record<string, FieldMapping> = {};
        standardFields.forEach((field) => {
          defaultMappings[field.id] = { jsonPath: "", mandatory: field.mandatory };
        });
        setMappings(defaultMappings);
        toast({
          title: "New Config",
          description: "Starting with default configuration. Make your changes and save.",
        });
      }

      setConfigLoaded(true);
      setIsLoading(false);
    }, 500);
  };

  const handleRunOcr = () => {
    setIsRunningOcr(true);
    
    // Simulate OCR processing
    setTimeout(() => {
      setOcrOutput(sampleOcrOutput);
      setIsRunningOcr(false);
      toast({
        title: "OCR Complete",
        description: "Document processed successfully. JSON output is ready for mapping.",
      });
    }, 1500);
  };

  const handleMappingChange = (fieldId: string, updates: Partial<FieldMapping>) => {
    setMappings((prev) => ({
      ...prev,
      [fieldId]: { ...prev[fieldId], ...updates },
    }));
  };

  const handleQuickAssign = (fieldId: string, jsonPath: string) => {
    handleMappingChange(fieldId, { jsonPath });
  };

  const handleAutoSuggest = () => {
    // Mock auto-suggest behavior
    const suggestions: Record<string, string> = {
      shipment_id: "$.document.shipment_number",
      sender_name: "$.sender.name",
      sender_address: "$.sender.full_address",
      receiver_name: "$.receiver.name",
      receiver_address: "$.receiver.full_address",
      weight: "$.package.weight_kg",
      dimensions: "$.package.dimensions_cm",
      ship_date: "$.dates.shipped",
      delivery_date: "$.dates.expected_delivery",
      tracking_number: "$.tracking.id",
    };

    setMappings((prev) => {
      const updated = { ...prev };
      Object.entries(suggestions).forEach(([fieldId, jsonPath]) => {
        if (!updated[fieldId]?.jsonPath) {
          updated[fieldId] = { ...updated[fieldId], jsonPath, mandatory: updated[fieldId]?.mandatory ?? false };
        }
      });
      return updated;
    });

    toast({
      title: "Auto-Suggest Complete",
      description: "Mappings have been suggested based on OCR output structure.",
    });
  };

  const handleSaveConfig = () => {
    toast({
      title: "Config Saved",
      description: "Configuration has been saved successfully.",
    });
  };

  const handleSavePrompt = () => {
    setIsDefaultPrompt(false);
    toast({
      title: "Prompt Saved",
      description: applyToOthers
        ? "Opening selection for additional targets..."
        : "Prompt has been saved for this configuration.",
    });

    if (applyToOthers) {
      setShowCopyModal(true);
    }
  };

  const handleApplyToTargets = (targets: string[]) => {
    toast({
      title: "Config Copied",
      description: `Configuration applied to ${targets.length} additional target(s).`,
    });
  };

  if (!configLoaded) {
    return (
      <div className="space-y-6 p-6">
        <FilterBar
          moduleId={moduleId}
          consignorId={consignorId}
          transporterId={transporterId}
          onModuleChange={handleModuleChange}
          onConsignorChange={handleConsignorChange}
          onTransporterChange={handleTransporterChange}
          onLoadConfig={handleLoadConfig}
          isLoading={isLoading}
          configLoaded={configLoaded}
        />

        <div className="flex h-[400px] items-center justify-center rounded-lg border-2 border-dashed bg-muted/30">
          <div className="text-center">
            <h3 className="text-lg font-medium text-foreground">
              Select a Configuration
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose a module and consignor, then click "Load / Create Config" to begin.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <FilterBar
        moduleId={moduleId}
        consignorId={consignorId}
        transporterId={transporterId}
        onModuleChange={handleModuleChange}
        onConsignorChange={handleConsignorChange}
        onTransporterChange={handleTransporterChange}
        onLoadConfig={handleLoadConfig}
        isLoading={isLoading}
        configLoaded={configLoaded}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Prompt & Sandbox */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Prompt & Sandbox</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <PromptEditor
              prompt={prompt}
              onPromptChange={(value) => {
                setPrompt(value);
                setIsDefaultPrompt(false);
              }}
              isDefault={isDefaultPrompt}
            />

            <div className="border-t pt-6">
              <SandboxUpload
                onRunOcr={handleRunOcr}
                isRunning={isRunningOcr}
                hasResult={!!ocrOutput}
              />
            </div>

            <div className="border-t pt-6">
              <OcrJsonViewer data={ocrOutput} />
            </div>

            <div className="border-t pt-6 space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="applyToOthers"
                  checked={applyToOthers}
                  onCheckedChange={(checked) => setApplyToOthers(!!checked)}
                />
                <label htmlFor="applyToOthers" className="text-sm cursor-pointer">
                  Apply this prompt to other combinations
                </label>
              </div>
              <Button onClick={handleSavePrompt} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Prompt for This Config
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Mapping & Mandatory Fields */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Field Mapping & Mandatory Fields</CardTitle>
              {ocrOutput && (
                <Button variant="outline" size="sm" onClick={handleAutoSuggest}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Auto-suggest Mapping
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <MappingTable
              mappings={mappings}
              onMappingChange={handleMappingChange}
              hasOcrOutput={!!ocrOutput}
            />

            <UnmappedFieldsPanel
              mappings={mappings}
              onQuickAssign={handleQuickAssign}
            />

            <div className="flex gap-3 border-t pt-6">
              <Button onClick={handleSaveConfig} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Save Config for This Combination
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCopyModal(true)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy to Others
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <SaveConfigModal
        open={showCopyModal}
        onOpenChange={setShowCopyModal}
        moduleId={moduleId}
        consignorId={consignorId}
        onApply={handleApplyToTargets}
      />
    </div>
  );
}