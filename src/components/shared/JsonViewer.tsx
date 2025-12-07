import { useState } from "react";
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface JsonViewerProps {
  data: unknown;
  className?: string;
  highlightPaths?: string[];
}

export function JsonViewer({ data, className, highlightPaths = [] }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative rounded-lg bg-muted/50 border border-border", className)}>
      <div className="absolute top-2 right-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 w-8 p-0"
        >
          {copied ? (
            <Check className="h-4 w-4 text-success" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <pre className="p-4 overflow-auto text-sm font-mono max-h-96">
        <JsonNode data={data} path="$" highlightPaths={highlightPaths} />
      </pre>
    </div>
  );
}

interface JsonNodeProps {
  data: unknown;
  path: string;
  highlightPaths: string[];
  depth?: number;
}

function JsonNode({ data, path, highlightPaths, depth = 0 }: JsonNodeProps) {
  const [expanded, setExpanded] = useState(depth < 2);
  const isHighlighted = highlightPaths.some((p) => path.startsWith(p) || p.startsWith(path));

  if (data === null) {
    return <span className="text-muted-foreground">null</span>;
  }

  if (typeof data === "boolean") {
    return <span className="text-info">{data.toString()}</span>;
  }

  if (typeof data === "number") {
    return <span className="text-warning">{data}</span>;
  }

  if (typeof data === "string") {
    return <span className="text-success">"{data}"</span>;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <span className="text-muted-foreground">[]</span>;
    }

    return (
      <span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center hover:bg-accent rounded"
        >
          {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </button>
        <span className="text-muted-foreground">[</span>
        {expanded ? (
          <>
            {data.map((item, index) => (
              <div key={index} style={{ marginLeft: "1.5rem" }}>
                <JsonNode
                  data={item}
                  path={`${path}[${index}]`}
                  highlightPaths={highlightPaths}
                  depth={depth + 1}
                />
                {index < data.length - 1 && <span className="text-muted-foreground">,</span>}
              </div>
            ))}
            <span className="text-muted-foreground">]</span>
          </>
        ) : (
          <span className="text-muted-foreground">...{data.length} items]</span>
        )}
      </span>
    );
  }

  if (typeof data === "object") {
    const entries = Object.entries(data);
    if (entries.length === 0) {
      return <span className="text-muted-foreground">{"{}"}</span>;
    }

    return (
      <span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center hover:bg-accent rounded"
        >
          {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </button>
        <span className="text-muted-foreground">{"{"}</span>
        {expanded ? (
          <>
            {entries.map(([key, value], index) => {
              const keyPath = `${path}.${key}`;
              const keyHighlighted = highlightPaths.includes(keyPath);
              return (
                <div key={key} style={{ marginLeft: "1.5rem" }}>
                  <span className={cn("text-primary", keyHighlighted && "bg-accent-foreground/20 px-1 rounded")}>
                    "{key}"
                  </span>
                  <span className="text-muted-foreground">: </span>
                  <JsonNode
                    data={value}
                    path={keyPath}
                    highlightPaths={highlightPaths}
                    depth={depth + 1}
                  />
                  {index < entries.length - 1 && <span className="text-muted-foreground">,</span>}
                </div>
              );
            })}
            <span className="text-muted-foreground">{"}"}</span>
          </>
        ) : (
          <span className="text-muted-foreground">...{entries.length} keys{"}"}</span>
        )}
      </span>
    );
  }

  return null;
}
