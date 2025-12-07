import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { consignors, transporters } from "@/lib/mockData";

interface SaveConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleId: string;
  consignorId: string;
  onApply: (targets: string[]) => void;
}

export function SaveConfigModal({
  open,
  onOpenChange,
  moduleId,
  consignorId,
  onApply,
}: SaveConfigModalProps) {
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);

  const moduleConsignors = consignors.filter((c) => c.moduleId === moduleId);
  const consignorTransporters = transporters.filter((t) => t.consignorId === consignorId);

  const handleToggle = (target: string) => {
    setSelectedTargets((prev) =>
      prev.includes(target)
        ? prev.filter((t) => t !== target)
        : [...prev, target]
    );
  };

  const handleApply = () => {
    onApply(selectedTargets);
    setSelectedTargets([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Copy Config to Other Combinations</DialogTitle>
          <DialogDescription>
            Select which combinations should receive this configuration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Quick Options</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={selectedTargets.includes("all_transporters")}
                  onCheckedChange={() => handleToggle("all_transporters")}
                />
                <span className="text-sm">All transporters for this consignor</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={selectedTargets.includes("all_consignors")}
                  onCheckedChange={() => handleToggle("all_consignors")}
                />
                <span className="text-sm">All consignors for this module</span>
              </label>
            </div>
          </div>

          {consignorTransporters.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Specific Transporters</h4>
              <div className="max-h-32 space-y-2 overflow-y-auto">
                {consignorTransporters.map((t) => (
                  <label key={t.id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={selectedTargets.includes(t.id)}
                      onCheckedChange={() => handleToggle(t.id)}
                    />
                    <span className="text-sm">{t.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {moduleConsignors.length > 1 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Other Consignors</h4>
              <div className="max-h-32 space-y-2 overflow-y-auto">
                {moduleConsignors
                  .filter((c) => c.id !== consignorId)
                  .map((c) => (
                    <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={selectedTargets.includes(c.id)}
                        onCheckedChange={() => handleToggle(c.id)}
                      />
                      <span className="text-sm">{c.name}</span>
                    </label>
                  ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={selectedTargets.length === 0}>
            Apply to {selectedTargets.length} target{selectedTargets.length !== 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}