import { useState } from "react";
import { ShieldCheck, Plus, Trash2, GripVertical, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { validationRules as initialRules, standardFields } from "@/lib/mockData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const operators = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Not Equals" },
  { value: "greater_than", label: "Greater Than" },
  { value: "less_than", label: "Less Than" },
  { value: "contains", label: "Contains" },
  { value: "not_empty", label: "Not Empty" },
  { value: "is_empty", label: "Is Empty" },
  { value: "matches", label: "Matches Regex" },
];

interface Rule {
  id: string;
  field: string;
  operator: string;
  value: string;
  action: string;
  message: string;
}

export default function ValidationRules() {
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const { toast } = useToast();

  const addRule = () => {
    const newRule: Rule = {
      id: `rule-${Date.now()}`,
      field: "",
      operator: "not_empty",
      value: "",
      action: "error",
      message: "",
    };
    setRules([...rules, newRule]);
  };

  const updateRule = (id: string, key: keyof Rule, value: string) => {
    setRules((prev) =>
      prev.map((rule) => (rule.id === id ? { ...rule, [key]: value } : rule))
    );
  };

  const deleteRule = (id: string) => {
    setRules((prev) => prev.filter((rule) => rule.id !== id));
    toast({
      title: "Rule Deleted",
      description: "Validation rule has been removed.",
    });
  };

  const handleSave = () => {
    toast({
      title: "Rules Saved",
      description: `${rules.length} validation rules saved successfully.`,
    });
  };

  // Simulate rule evaluation results
  const evaluationResults = [
    { ruleId: "rule-1", passed: true, testedValue: "245.5" },
    { ruleId: "rule-2", passed: true, testedValue: "2024-03-15" },
    { ruleId: "rule-3", passed: false, testedValue: "0" },
    { ruleId: "rule-4", passed: true, testedValue: null },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Validation Rules</h1>
        <p className="text-muted-foreground">
          Define rules to validate extracted data and trigger warnings or errors.
        </p>
      </div>

      {/* Rule Builder */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Rule Builder
              </CardTitle>
              <CardDescription>
                Create conditional validation rules for extracted fields
              </CardDescription>
            </div>
            <Button onClick={addRule}>
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule, index) => (
              <div
                key={rule.id}
                className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/30"
              >
                <div className="flex items-center gap-2 pt-2 text-muted-foreground">
                  <GripVertical className="h-4 w-4 cursor-grab" />
                  <span className="text-sm font-medium">#{index + 1}</span>
                </div>

                <div className="flex-1 grid gap-4 md:grid-cols-6">
                  <div className="md:col-span-1">
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      If Field
                    </Label>
                    <Select
                      value={rule.field}
                      onValueChange={(v) => updateRule(rule.id, "field", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {standardFields.map((field) => (
                          <SelectItem key={field.id} value={field.id}>
                            {field.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-1">
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      Operator
                    </Label>
                    <Select
                      value={rule.operator}
                      onValueChange={(v) => updateRule(rule.id, "operator", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {operators.map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-1">
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      Value
                    </Label>
                    <Input
                      value={rule.value}
                      onChange={(e) => updateRule(rule.id, "value", e.target.value)}
                      placeholder="Compare value"
                      disabled={["not_empty", "is_empty"].includes(rule.operator)}
                    />
                  </div>

                  <div className="md:col-span-1">
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      Then
                    </Label>
                    <Select
                      value={rule.action}
                      onValueChange={(v) => updateRule(rule.id, "action", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      Message
                    </Label>
                    <Input
                      value={rule.message}
                      onChange={(e) => updateRule(rule.id, "message", e.target.value)}
                      placeholder="Validation message"
                    />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => deleteRule(rule.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {rules.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <ShieldCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No validation rules defined</p>
                <p className="text-sm">Click "Add Rule" to create your first rule</p>
              </div>
            )}
          </div>

          {rules.length > 0 && (
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline">Reset</Button>
              <Button onClick={handleSave}>Save Rules</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rule Evaluation Preview */}
      {rules.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Evaluation Preview</CardTitle>
            <CardDescription>
              Test results based on sample OCR output
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rules.map((rule) => {
                const result = evaluationResults.find((r) => r.ruleId === rule.id);
                const passed = result?.passed ?? true;

                return (
                  <div
                    key={rule.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      passed
                        ? "bg-muted/30 border-border"
                        : rule.action === "error"
                        ? "bg-destructive/10 border-destructive/30"
                        : "bg-warning/10 border-warning/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {passed ? (
                        <ShieldCheck className="h-5 w-5 text-success" />
                      ) : rule.action === "error" ? (
                        <XCircle className="h-5 w-5 text-destructive" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-warning" />
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {standardFields.find((f) => f.id === rule.field)?.name || rule.field}{" "}
                          {operators.find((o) => o.value === rule.operator)?.label.toLowerCase()}{" "}
                          {rule.value && `"${rule.value}"`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {result?.testedValue
                            ? `Tested value: "${result.testedValue}"`
                            : "No value to test"}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={passed ? "success" : rule.action === "error" ? "error" : "warning"}>
                      {passed ? "Passed" : rule.action === "error" ? "Failed" : "Warning"}
                    </StatusBadge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
