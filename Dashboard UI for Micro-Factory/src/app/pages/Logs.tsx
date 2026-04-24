import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Search, Download, Filter } from "lucide-react";

export function Logs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [logs, setLogs] = useState<any[]>([]);

  // 🔥 Fetch logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("https://localhost:7124/api/logs");
        const data = await res.json();

        const formatted = data.map((log: any, index: number) => ({
          id: index,
          timestamp: new Date(log.timestamp).toLocaleString(),
          level: log.level?.toLowerCase(),
          category: log.category,
          message: log.message,
        }));

        setLogs(formatted);
      } catch (err) {
        console.error("❌ erreur logs:", err);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  // 🔥 Export JSON
  const exportLogs = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `logs-${new Date().toISOString()}.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      case "success":
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "error":
        return "Erreur";
      case "warning":
        return "Attention";
      case "success":
        return "Succès";
      default:
        return "Info";
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = filterLevel === "all" || log.level === filterLevel;

    return matchesSearch && matchesLevel;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Logs Système</h1>
          <p className="text-slate-600 mt-1">
            Historique et suivi des événements
          </p>
        </div>

        <Button onClick={exportLogs}>
          <Download className="size-4 mr-2" />
          Exporter les logs
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-[200px]">
                <Filter className="size-4 mr-2" />
                <SelectValue placeholder="Filtrer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Succès</SelectItem>
                <SelectItem value="warning">Attention</SelectItem>
                <SelectItem value="error">Erreur</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Logs en temps réel</CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="system">Système</TabsTrigger>
              <TabsTrigger value="motor">Moteurs</TabsTrigger>
              <TabsTrigger value="sensor">Capteurs</TabsTrigger>
              <TabsTrigger value="action">Actions</TabsTrigger>
            </TabsList>

            {["all", "system", "motor", "sensor", "action"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-4">
                <LogsList
                  logs={
                    tab === "all"
                      ? filteredLogs
                      : filteredLogs.filter((l) => l.category === tab)
                  }
                  getLevelColor={getLevelColor}
                  getLevelLabel={getLevelLabel}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function LogsList({
  logs,
  getLevelColor,
  getLevelLabel,
}: {
  logs: any[];
  getLevelColor: (level: string) => string;
  getLevelLabel: (level: string) => string;
}) {
  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-2">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-3 p-3 rounded-lg border hover:bg-slate-50 text-sm"
          >
            <Badge className={getLevelColor(log.level)}>
              {getLevelLabel(log.level)}
            </Badge>

            <div className="flex-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>{log.timestamp}</span>
                <Badge variant="outline">{log.category}</Badge>
              </div>

              <p className="text-slate-900">{log.message}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}