import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface PromptEditorProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  isDefault: boolean;
}

export function PromptEditor({ prompt, onPromptChange, isDefault }: PromptEditorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">OCR Prompt</h3>
        {isDefault && (
          <Badge variant="secondary" className="text-xs">
            Default prompt loaded
          </Badge>
        )}
      </div>
      
      <Textarea
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder="Enter your OCR extraction prompt..."
        className="min-h-[180px] resize-none bg-background font-mono text-sm"
      />
      
      <p className="text-xs text-muted-foreground">
        Editing this prompt will override defaults for this filter combination.
      </p>
    </div>
  );
}