import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { standardFields, jsonPathSuggestions } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export interface FieldMapping {
  jsonPath: string;
  mandatory: boolean;
}

interface MappingTableProps {
  mappings: Record<string, FieldMapping>;
  onMappingChange: (fieldId: string, updates: Partial<FieldMapping>) => void;
  hasOcrOutput: boolean;
}

export function MappingTable({ mappings, onMappingChange, hasOcrOutput }: MappingTableProps) {
  const getFieldStatus = (fieldId: string) => {
    const mapping = mappings[fieldId];
    const field = standardFields.find((f) => f.id === fieldId);
    const isMandatory = mapping?.mandatory ?? field?.mandatory ?? false;
    const hasMapping = mapping?.jsonPath && mapping.jsonPath.length > 0;

    if (isMandatory && !hasMapping) return "error";
    if (!hasMapping) return "unmapped";
    return "mapped";
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "mapped":
        return <Badge className="bg-success/10 text-success hover:bg-success/20">Mapped</Badge>;
      case "unmapped":
        return <Badge variant="secondary" className="bg-warning/10 text-warning hover:bg-warning/20">Unmapped</Badge>;
      case "error":
        return <Badge variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive/20">Required</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[180px]">Field Name</TableHead>
            <TableHead className="w-[80px]">Type</TableHead>
            <TableHead>JSON Path / Source</TableHead>
            <TableHead className="w-[90px] text-center">Mandatory</TableHead>
            <TableHead className="w-[90px] text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standardFields.map((field) => {
            const mapping = mappings[field.id] || { jsonPath: "", mandatory: field.mandatory };
            const status = getFieldStatus(field.id);

            return (
              <TableRow
                key={field.id}
                className={cn(
                  status === "error" && "bg-destructive/5"
                )}
              >
                <TableCell className="font-medium">{field.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs capitalize">
                    {field.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  {hasOcrOutput ? (
                    <Select
                      value={mapping.jsonPath || "none"}
                      onValueChange={(value) =>
                        onMappingChange(field.id, { jsonPath: value === "none" ? "" : value })
                      }
                    >
                      <SelectTrigger className="h-8 bg-background text-xs">
                        <SelectValue placeholder="Select JSON path" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="none">-- Not mapped --</SelectItem>
                        {jsonPathSuggestions.map((path) => (
                          <SelectItem key={path} value={path} className="text-xs">
                            {path}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={mapping.jsonPath}
                      onChange={(e) =>
                        onMappingChange(field.id, { jsonPath: e.target.value })
                      }
                      placeholder="$.path.to.field"
                      className="h-8 bg-background text-xs"
                    />
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={mapping.mandatory}
                    onCheckedChange={(checked) =>
                      onMappingChange(field.id, { mandatory: checked })
                    }
                  />
                </TableCell>
                <TableCell className="text-center">
                  {statusBadge(status)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}