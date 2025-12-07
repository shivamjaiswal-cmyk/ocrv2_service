import { useState } from "react";
import { History, Filter, Download, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { auditTrail } from "@/lib/mockData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const changeTypeColors: Record<string, "success" | "warning" | "info" | "error" | "default"> = {
  prompt: "info",
  mapping: "success",
  validation: "warning",
  mandatory: "error",
  config: "default",
};

export default function AuditTrail() {
  const [filterUser, setFilterUser] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedEntry, setSelectedEntry] = useState<typeof auditTrail[0] | null>(null);
  const { toast } = useToast();

  const filteredAudit = auditTrail.filter((entry) => {
    if (filterUser && !entry.user.toLowerCase().includes(filterUser.toLowerCase())) {
      return false;
    }
    if (filterType !== "all" && entry.changeType !== filterType) {
      return false;
    }
    return true;
  });

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Audit log will be downloaded as CSV.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Audit Trail</h1>
        <p className="text-muted-foreground">
          Track all configuration changes with detailed before/after comparisons.
        </p>
      </div>

      {/* Filters */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Filters
            </CardTitle>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label className="text-sm">User</Label>
              <Input
                placeholder="Search by user..."
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Change Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="prompt">Prompt</SelectItem>
                  <SelectItem value="mapping">Mapping</SelectItem>
                  <SelectItem value="validation">Validation</SelectItem>
                  <SelectItem value="mandatory">Mandatory</SelectItem>
                  <SelectItem value="config">Config</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Date From</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Date To</Label>
              <Input type="date" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Change History
          </CardTitle>
          <CardDescription>
            Showing {filteredAudit.length} entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead className="w-[180px]">User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAudit.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-mono text-sm">
                      {formatDate(entry.timestamp)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                          {entry.user.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm truncate">{entry.user}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{entry.action}</TableCell>
                    <TableCell className="text-muted-foreground">{entry.entity}</TableCell>
                    <TableCell>
                      <StatusBadge status={changeTypeColors[entry.changeType] || "default"}>
                        {entry.changeType}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedEntry(entry)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Change Details</DialogTitle>
                            <DialogDescription>
                              {entry.action} on {formatDate(entry.timestamp)}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <Label className="text-muted-foreground">User</Label>
                                <p className="font-medium">{entry.user}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">Entity</Label>
                                <p className="font-medium">{entry.entity}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm text-muted-foreground mb-2 block">
                                  Before
                                </Label>
                                <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20 min-h-24">
                                  <pre className="text-sm whitespace-pre-wrap">
                                    {entry.before || "—"}
                                  </pre>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm text-muted-foreground mb-2 block">
                                  After
                                </Label>
                                <div className="p-4 bg-success/10 rounded-lg border border-success/20 min-h-24">
                                  <pre className="text-sm whitespace-pre-wrap">
                                    {entry.after || "—"}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing 1-{filteredAudit.length} of {filteredAudit.length} entries
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
