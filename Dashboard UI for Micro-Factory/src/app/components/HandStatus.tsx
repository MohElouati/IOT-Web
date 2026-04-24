import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Hand, Circle } from "lucide-react";

interface HandStatusProps {
  hand: "left" | "right";
  status: "active" | "idle" | "error";
  position: { x: number; y: number; z: number };
  grip: number;
}

export function HandStatus({ hand, status, position, grip }: HandStatusProps) {
  const statusColors = {
    active: "bg-green-500",
    idle: "bg-yellow-500",
    error: "bg-red-500",
  };

  const statusLabels = {
    active: "Active",
    idle: "En attente",
    error: "Erreur",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hand className="size-5 text-blue-600" />
            <CardTitle>
              Main {hand === "left" ? "Gauche" : "Droite"}
            </CardTitle>
          </div>
          <Badge className={statusColors[status]}>
            <Circle className="size-2 mr-1 fill-current" />
            {statusLabels[status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Position */}
        <div>
          <div className="text-sm font-medium text-slate-600 mb-2">
            Position (mm)
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-100 rounded-lg p-2 text-center">
              <div className="text-xs text-slate-500">X</div>
              <div className="text-lg font-bold text-slate-900">{position.x}</div>
            </div>
            <div className="bg-slate-100 rounded-lg p-2 text-center">
              <div className="text-xs text-slate-500">Y</div>
              <div className="text-lg font-bold text-slate-900">{position.y}</div>
            </div>
            <div className="bg-slate-100 rounded-lg p-2 text-center">
              <div className="text-xs text-slate-500">Z</div>
              <div className="text-lg font-bold text-slate-900">{position.z}</div>
            </div>
          </div>
        </div>

        {/* Grip Strength */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">
              Force de préhension
            </span>
            <span className="text-sm font-bold text-slate-900">{grip}%</span>
          </div>
          <Progress value={grip} className="h-2" />
        </div>

        {/* Motors Status */}
        <div>
          <div className="text-sm font-medium text-slate-600 mb-2">
            Moteurs
          </div>
          <div className="space-y-1">
            {["M1", "M2", "M3", "M4", "M5"].map((motor, idx) => (
              <div key={motor} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{motor}</span>
                <span className="font-mono text-slate-900">
                  {Math.floor(Math.random() * 180)}°
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
