import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { standardFields, jsonPathSuggestions } from "@/lib/mockData";
import { AlertTriangle } from "lucide-react";
import { FieldMapping } from "./MappingTable";

interface UnmappedFieldsPanelProps {
  mappings: Record<string, FieldMapping>;
  onQuickAssign: (fieldId: string, jsonPath: string) => void;
}

export function UnmappedFieldsPanel({ mappings, onQuickAssign }: UnmappedFieldsPanelProps) {
  const unmappedRequired = standardFields.filter((field) => {
    const mapping = mappings[field.id];
    const isMandatory = mapping?.mandatory ?? field.mandatory;
    const hasMapping = mapping?.jsonPath && mapping.jsonPath.length > 0;
    return isMandatory && !hasMapping;
  });

  if (unmappedRequired.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <h4 className="text-sm font-medium text-foreground">
          Unmapped Required Fields
        </h4>
        <Badge variant="secondary" className="bg-warning/20 text-warning">
          {unmappedRequired.length}
        </Badge>
      </div>
      
      <div className="space-y-2">
        {unmappedRequired.map((field) => (
          <div key={field.id} className="flex items-center gap-3">
            <span className="w-32 text-sm text-foreground">{field.name}</span>
            <Select
              onValueChange={(value) => onQuickAssign(field.id, value)}
            >
              <SelectTrigger className="h-8 flex-1 bg-background text-xs">
                <SelectValue placeholder="Assign from OCR JSON..." />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {jsonPathSuggestions.map((path) => (
                  <SelectItem key={path} value={path} className="text-xs">
                    {path}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
}