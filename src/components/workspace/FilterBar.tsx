import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const filteredConsignors = consignors.filter((c) => c.moduleId === moduleId);
  const filteredTransporters = transporters.filter(
    (t) => t.consignorId === consignorId
  );

  const getContextLabel = () => {
    if (!moduleId || !consignorId) return null;
    const module = modules.find((m) => m.id === moduleId);
    const consignor = consignors.find((c) => c.id === consignorId);
    const transporter = transporterId
      ? transporters.find((t) => t.id === transporterId)
      : null;

    return `${module?.name} / ${consignor?.name} / ${transporter?.name || "All Transporters"}`;
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
          <Select
            value={consignorId}
            onValueChange={onConsignorChange}
            disabled={!moduleId}
          >
            <SelectTrigger className="w-44 bg-background">
              <SelectValue placeholder="Select consignor" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              {filteredConsignors.map((consignor) => (
                <SelectItem key={consignor.id} value={consignor.id}>
                  {consignor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">Transporter</label>
          <Select
            value={transporterId}
            onValueChange={onTransporterChange}
            disabled={!consignorId}
          >
            <SelectTrigger className="w-44 bg-background">
              <SelectValue placeholder="All Transporters" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Transporters</SelectItem>
              {filteredTransporters.map((transporter) => (
                <SelectItem key={transporter.id} value={transporter.id}>
                  {transporter.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={onLoadConfig}
          disabled={!moduleId || !consignorId || isLoading}
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