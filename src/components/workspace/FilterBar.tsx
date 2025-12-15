import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// ... (imports)
import { modules, consignors, transporters } from "@/lib/mockData";
import { Loader2 } from "lucide-react";

interface FilterBarProps {
  moduleId: string;
  consignorId: string;
  transporterId: string;
  onModuleChange: (value: string) => void;
  onConsignorChange: (value: string) => void;
  onTransporterChange: (value: string) => void;
  onLoadConfig: () => void;
  isLoading?: boolean;
  configLoaded?: boolean;
}

export function FilterBar({
  moduleId,
  consignorId,
  transporterId,
  onModuleChange,
  onConsignorChange,
  onTransporterChange,
  onLoadConfig,
  isLoading = false,
  configLoaded = false,
}: FilterBarProps) {
  // We can remove filtered lists since we are using free text now, or keep them if we want to add back a combobox later. 
  // For now, free text doesn't need them, but contextLabel uses them for name lookup.

  const getContextLabel = () => {
    if (!moduleId) return null; // Consignor can be null now
    const module = modules.find((m) => m.id === moduleId);

    // For context label, if we have an ID, we try to find name, else show ID.
    const consignorName = consignorId
      ? (consignors.find((c) => c.id === consignorId)?.name || consignorId)
      : "All Consignors";

    const transporterName = transporterId
      ? (transporters.find((t) => t.id === transporterId)?.name || transporterId)
      : "All Transporters";

    return `${module?.name || moduleId} / ${consignorName} / ${transporterName}`;
  };

  const contextLabel = getContextLabel();

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">Module</label>
          <Select value={moduleId} onValueChange={onModuleChange}>
            <SelectTrigger className="w-40 bg-background">
              <SelectValue placeholder="Select module" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              {modules.map((module) => (
                <SelectItem key={module.id} value={module.id}>
                  {module.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">Consignor</label>
          <div className="flex items-center gap-2 rounded-md border p-1 bg-background">
            <div className="flex items-center gap-1.5 px-2 border-r">
              <Checkbox
                id="allConsignors"
                checked={!consignorId}
                onCheckedChange={(checked) => {
                  if (checked) onConsignorChange("");
                }}
              />
              <label htmlFor="allConsignors" className="text-xs font-medium cursor-pointer">
                All
              </label>
            </div>
            <Input
              value={consignorId}
              onChange={(e) => onConsignorChange(e.target.value)}
              placeholder="Enter ID..."
              className="h-7 w-32 border-0 focus-visible:ring-0 px-2"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">Transporter</label>
          <div className="flex items-center gap-2 rounded-md border p-1 bg-background">
            <div className="flex items-center gap-1.5 px-2 border-r">
              <Checkbox
                id="allTransporters"
                checked={!transporterId}
                onCheckedChange={(checked) => {
                  if (checked) onTransporterChange("");
                }}
              />
              <label htmlFor="allTransporters" className="text-xs font-medium cursor-pointer">
                All
              </label>
            </div>
            <Input
              value={transporterId}
              onChange={(e) => onTransporterChange(e.target.value)}
              placeholder="Enter ID..."
              className="h-7 w-32 border-0 focus-visible:ring-0 px-2"
            />
          </div>
        </div>

        <Button
          onClick={onLoadConfig}
          disabled={!moduleId || isLoading}
          className="ml-auto"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {configLoaded ? "Reload Config" : "Load / Create Config"}
        </Button>
      </div>

      {contextLabel && configLoaded && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Current Context:</span>
          <span className="rounded-md bg-primary/10 px-2 py-1 text-sm font-medium text-primary">
            {contextLabel}
          </span>
        </div>
      )}
    </div>
  );
}