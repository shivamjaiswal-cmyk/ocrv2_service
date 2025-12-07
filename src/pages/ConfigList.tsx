import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { configs, modules, consignors, transporters } from "@/lib/mockData";
import { Search, Edit, Copy, MoreHorizontal, Trash2, Check, X } from "lucide-react";

export default function ConfigList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const getModuleName = (moduleId: string) =>
    modules.find((m) => m.id === moduleId)?.name || moduleId;

  const getConsignorName = (consignorId: string | null) =>
    consignorId
      ? consignors.find((c) => c.id === consignorId)?.name || consignorId
      : "—";

  const getTransporterName = (transporterId: string | null) =>
    transporterId
      ? transporters.find((t) => t.id === transporterId)?.name
      : "All";

  const filteredConfigs = configs.filter((config) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const moduleName = getModuleName(config.moduleId).toLowerCase();
    const consignorName = getConsignorName(config.consignorId).toLowerCase();
    const transporterName = getTransporterName(config.transporterId)?.toLowerCase() || "";
    
    return (
      moduleName.includes(query) ||
      consignorName.includes(query) ||
      transporterName.includes(query)
    );
  });

  const handleEdit = (config: typeof configs[0]) => {
    const params = new URLSearchParams({
      module: config.moduleId,
      consignor: config.consignorId || "",
      ...(config.transporterId && { transporter: config.transporterId }),
    });
    navigate(`/?${params.toString()}`);
  };

  const handleDuplicate = (config: typeof configs[0]) => {
    toast({
      title: "Duplicate Config",
      description: "Select a target combination for the duplicated config.",
    });
  };

  const handleDelete = (config: typeof configs[0]) => {
    toast({
      title: "Config Deleted",
      description: "The configuration has been deactivated.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Active OCR Configurations
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage all your OCR configurations across modules and consignors.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by module, consignor, or transporter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>
        <Badge variant="secondary" className="text-sm">
          {filteredConfigs.length} config{filteredConfigs.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Module</TableHead>
              <TableHead>Consignor</TableHead>
              <TableHead>Transporter</TableHead>
              <TableHead className="text-center">Custom Prompt</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Updated By</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConfigs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No configurations found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredConfigs.map((config) => (
                <TableRow key={config.id} className="group">
                  <TableCell className="font-medium">
                    {getModuleName(config.moduleId)}
                  </TableCell>
                  <TableCell>{getConsignorName(config.consignorId)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {getTransporterName(config.transporterId)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {config.hasCustomPrompt ? (
                      <Check className="mx-auto h-4 w-4 text-success" />
                    ) : (
                      <X className="mx-auto h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {config.updatedAt}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {config.updatedBy}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover">
                        <DropdownMenuItem onClick={() => handleEdit(config)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(config)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(config)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}