import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Wifi, Camera, Gauge, Move } from "lucide-react";
import { Badge } from "./ui/badge";

export function SensorGrid() {
  const sensors = [
    {
      id: 1,
      name: "Capteur de proximité",
      icon: Wifi,
      value: "12 cm",
      status: "active",
      color: "text-blue-500",
    },
    {
      id: 2,
      name: "Caméra principale",
      icon: Camera,
      value: "1080p @ 30fps",
      status: "active",
      color: "text-purple-500",
    },
    {
      id: 3,
      name: "Capteur de pression",
      icon: Gauge,
      value: "2.4 N",
      status: "active",
      color: "text-green-500",
    },
    {
      id: 4,
      name: "Accéléromètre",
      icon: Move,
      value: "0.02 g",
      status: "active",
      color: "text-orange-500",
    },
    {
      id: 5,
      name: "Capteur tactile",
      icon: Gauge,
      value: "Actif",
      status: "active",
      color: "text-pink-500",
    },
    {
      id: 6,
      name: "Gyroscope",
      icon: Move,
      value: "±0.5°/s",
      status: "active",
      color: "text-cyan-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Capteurs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sensors.map((sensor) => {
            const Icon = sensor.icon;
            return (
              <div
                key={sensor.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
              >
                <div className={`p-2 rounded-lg bg-slate-100 ${sensor.color}`}>
                  <Icon className="size-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-slate-900">
                      {sensor.name}
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-xs border-green-500 text-green-600"
                    >
                      OK
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mt-0.5">
                    {sensor.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
