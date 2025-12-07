import { useState } from "react";
import { GitBranch, Copy, Plus, ChevronRight, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HierarchySelector } from "@/components/shared/HierarchySelector";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { configs, modules, consignors, transporters } from "@/lib/mockData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Selection {
  moduleId: string | null;
  consignorId: string | null;
  transporterId: string | null;
}

export default function ConfigHierarchy() {
  const [selection, setSelection] = useState<Selection>({
    moduleId: null,
    consignorId: null,
    transporterId: null,
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const getEffectiveConfig = () => {
    const { moduleId, consignorId, transporterId } = selection;
    
    // Check for transporter-level config
    if (transporterId) {
      const config = configs.find(
        (c) => c.moduleId === moduleId && c.consignorId === consignorId && c.transporterId === transporterId
      );
      if (config) return { config, level: "transporter" as const };
    }
    
    // Check for consignor-level config
    if (consignorId) {
      const config = configs.find(
        (c) => c.moduleId === moduleId && c.consignorId === consignorId && !c.transporterId
      );
      if (config) return { config, level: "consignor" as const };
    }
    
    // Check for module-level config
    if (moduleId) {
      const config = configs.find(
        (c) => c.moduleId === moduleId && !c.consignorId && !c.transporterId
      );
      if (config) return { config, level: "module" as const };
    }
    
    return null;
  };

  const effectiveConfig = getEffectiveConfig();

  const getInheritanceChain = () => {
    const chain = [];
    const { moduleId, consignorId, transporterId } = selection;
    
    if (moduleId) {
      const moduleConfig = configs.find(
        (c) => c.moduleId === moduleId && !c.consignorId && !c.transporterId
      );
      chain.push({
        level: "Module",
        name: modules.find((m) => m.id === moduleId)?.name || moduleId,
        hasConfig: !!moduleConfig,
        isActive: effectiveConfig?.level === "module",
      });
    }
    
    if (consignorId) {
      const consignorConfig = configs.find(
        (c) => c.moduleId === moduleId && c.consignorId === consignorId && !c.transporterId
      );
      chain.push({
        level: "Consignor",
        name: consignors.find((c) => c.id === consignorId)?.name || consignorId,
        hasConfig: !!consignorConfig,
        isActive: effectiveConfig?.level === "consignor",
      });
    }
    
    if (transporterId) {
      const transporterConfig = configs.find(
        (c) => c.moduleId === moduleId && c.consignorId === consignorId && c.transporterId === transporterId
      );
      chain.push({
        level: "Transporter",
        name: transporters.find((t) => t.id === transporterId)?.name || transporterId,
        hasConfig: !!transporterConfig,
        isActive: effectiveConfig?.level === "transporter",
      });
    }
    
    return chain;
  };

  const getCurrentLevel = () => {
    if (selection.transporterId) return "Transporter";
    if (selection.consignorId) return "Consignor";
    if (selection.moduleId) return "Module";
    return null;
  };

  const handleCreateConfig = () => {
    toast({
      title: "Config Created",
      description: `New configuration created at ${getCurrentLevel()} level.`,
    });
    setCreateDialogOpen(false);
  };

  const handleCloneConfig = () => {
    toast({
      title: "Config Cloned",
      description: "Configuration cloned successfully.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Config Hierarchy</h1>
        <p className="text-muted-foreground">
          Configure OCR settings across modules, consignors, and transporters.
        </p>
      </div>

      {/* Hierarchy Selector */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            Select Configuration Level
          </CardTitle>
          <CardDescription>
            Choose the hierarchy level to view or create configurations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HierarchySelector onSelectionChange={setSelection} />
        </CardContent>
      </Card>

      {/* Inheritance Visualization */}
      {selection.moduleId && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Inheritance Chain</CardTitle>
            <CardDescription>
              Configuration inheritance from module to specific level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 flex-wrap">
              {getInheritanceChain().map((item, index) => (
                <div key={item.level} className="flex items-center gap-2">
                  {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  <div
                    className={`px-4 py-2 rounded-lg border ${
                      item.isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : item.hasConfig
                        ? "bg-accent border-primary/30"
                        : "bg-muted border-border"
                    }`}
                  >
                    <div className="text-xs font-medium opacity-75">{item.level}</div>
                    <div className="font-medium">{item.name}</div>
                    {item.hasConfig && !item.isActive && (
                      <div className="text-xs opacity-75">Has config</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-2 p-3 bg-info/10 rounded-lg border border-info/20">
              <Info className="h-4 w-4 text-info shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                Configuration at the most specific level takes priority. When no config exists at a level, 
                settings are inherited from the parent level.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Effective Configuration */}
      {effectiveConfig && (
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Effective Configuration</CardTitle>
                <CardDescription>
                  Active config from{" "}
                  <StatusBadge status="info">{effectiveConfig.level}</StatusBadge> level
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create at This Level
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Configuration</DialogTitle>
                      <DialogDescription>
                        Create a new configuration at the {getCurrentLevel()} level.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Prompt Template</Label>
                        <Textarea
                          placeholder="Enter your OCR extraction prompt..."
                          className="min-h-32"
                          defaultValue={effectiveConfig.config.prompt}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateConfig}>Create Config</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" onClick={handleCloneConfig}>
                  <Copy className="h-4 w-4 mr-2" />
                  Clone Config
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Config ID</Label>
                  <p className="font-mono text-sm">{effectiveConfig.config.id}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Version</Label>
                  <p className="font-mono text-sm">v{effectiveConfig.config.version}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Created</Label>
                  <p className="text-sm">{effectiveConfig.config.createdAt}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Last Updated</Label>
                  <p className="text-sm">{effectiveConfig.config.updatedAt}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Prompt</Label>
                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <p className="text-sm whitespace-pre-wrap">{effectiveConfig.config.prompt}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Selection State */}
      {!selection.moduleId && (
        <Card className="shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GitBranch className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Select a Module</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Choose a module from the dropdown above to view its configuration hierarchy
              and create or modify settings.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
