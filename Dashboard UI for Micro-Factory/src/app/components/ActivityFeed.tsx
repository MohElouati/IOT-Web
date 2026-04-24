import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

export function ActivityFeed() {
  const activities = [
    {
      id: 1,
      type: "success",
      message: "Scroll effectué avec succès",
      time: "Il y a 2 min",
    },
    {
      id: 2,
      type: "info",
      message: "Main droite repositionnée",
      time: "Il y a 5 min",
    },
    {
      id: 3,
      type: "success",
      message: "Publication postée",
      time: "Il y a 8 min",
    },
    {
      id: 4,
      type: "warning",
      message: "Calibration requise - Main gauche",
      time: "Il y a 12 min",
    },
    {
      id: 5,
      type: "success",
      message: "Connexion API établie",
      time: "Il y a 15 min",
    },
    {
      id: 6,
      type: "info",
      message: "Capteur tactile activé",
      time: "Il y a 18 min",
    },
    {
      id: 7,
      type: "success",
      message: "Double tap détecté",
      time: "Il y a 22 min",
    },
    {
      id: 8,
      type: "info",
      message: "Mode automatique activé",
      time: "Il y a 25 min",
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="size-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="size-4 text-yellow-500" />;
      default:
        return <Info className="size-4 text-blue-500" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Activité Récente</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="mt-0.5">{getIcon(activity.type)}</div>
                <div className="flex-1">
                  <p className="text-sm text-slate-900">{activity.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
