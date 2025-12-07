import { useState } from "react";
import { ListChecks, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { standardFields as initialFields } from "@/lib/mockData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

const validatorTypes = [
  { value: "none", label: "None" },
  { value: "regex", label: "Regex Pattern" },
  { value: "minmax", label: "Min/Max Value" },
  { value: "length", label: "Length" },
  { value: "custom", label: "Custom" },
];

interface FieldConfig {
  id: string;
  name: string;
  type: string;
  mandatory: boolean;
  validatorType: string;
  validatorValue: string;
  errorMessage: string;
}

export default function MandatoryFields() {
  const [fields, setFields] = useState<FieldConfig[]>(
    initialFields.map((f) => ({
      ...f,
      validatorType: "none",
      validatorValue: "",
      errorMessage: "",
    }))
  );
  const { toast } = useToast();

  const updateField = (id: string, key: keyof FieldConfig, value: string | boolean) => {
    setFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, [key]: value } : field))
    );
  };

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Mandatory field configuration updated successfully.",
    });
  };

  const mandatoryCount = fields.filter((f) => f.mandatory).length;
  const optionalCount = fields.filter((f) => !f.mandatory).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Mandatory Fields</h1>
        <p className="text-muted-foreground">
          Configure which fields are required and add validation rules.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Fields</p>
                <p className="text-2xl font-bold">{fields.length}</p>
              </div>
              <ListChecks className="h-8 w-8 text-primary opacity-75" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mandatory</p>
                <p className="text-2xl font-bold text-destructive">{mandatoryCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive opacity-75" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Optional</p>
                <p className="text-2xl font-bold text-success">{optionalCount}</p>
              </div>
              <Info className="h-8 w-8 text-success opacity-75" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Field Configuration */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" />
                Field Configuration
              </CardTitle>
              <CardDescription>
                Toggle mandatory status and configure validators
              </CardDescription>
            </div>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {fields.map((field) => (
              <AccordionItem key={field.id} value={field.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between flex-1 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{field.name}</span>
                      <StatusBadge status="default">{field.type}</StatusBadge>
                    </div>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Label className="text-sm text-muted-foreground">
                        {field.mandatory ? "Required" : "Optional"}
                      </Label>
                      <Switch
                        checked={field.mandatory}
                        onCheckedChange={(v) => updateField(field.id, "mandatory", v)}
                      />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4 md:grid-cols-3 pt-4 pb-2">
                    <div className="space-y-2">
                      <Label className="text-sm">Validator Type</Label>
                      <Select
                        value={field.validatorType}
                        onValueChange={(v) => updateField(field.id, "validatorType", v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {validatorTypes.map((vt) => (
                            <SelectItem key={vt.value} value={vt.value}>
                              {vt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">
                        {field.validatorType === "regex"
                          ? "Pattern"
                          : field.validatorType === "minmax"
                          ? "Range (min-max)"
                          : field.validatorType === "length"
                          ? "Length (min-max)"
                          : "Validator Value"}
                      </Label>
                      <Input
                        value={field.validatorValue}
                        onChange={(e) =>
                          updateField(field.id, "validatorValue", e.target.value)
                        }
                        placeholder={
                          field.validatorType === "regex"
                            ? "^[A-Z]{2}[0-9]{4}$"
                            : field.validatorType === "minmax"
                            ? "0-1000"
                            : field.validatorType === "length"
                            ? "3-50"
                            : "Enter value"
                        }
                        disabled={field.validatorType === "none"}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Custom Error Message</Label>
                      <Input
                        value={field.errorMessage}
                        onChange={(e) =>
                          updateField(field.id, "errorMessage", e.target.value)
                        }
                        placeholder="e.g., Invalid format for this field"
                        disabled={field.validatorType === "none"}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Sandbox Warning Preview */}
      <Card className="shadow-soft border-warning/30 bg-warning/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Sandbox Warning Preview
          </CardTitle>
          <CardDescription>
            These warnings will appear in the OCR Sandbox when mandatory fields are missing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {fields
              .filter((f) => f.mandatory)
              .slice(0, 5)
              .map((field) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-background border border-border"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium">{field.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {field.errorMessage || `${field.name} is required`}
                  </span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
