import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { HandStatus } from "../components/HandStatus";
import { SensorGrid } from "../components/SensorGrid";
import { ActivityFeed } from "../components/ActivityFeed";
import { Activity, Cpu, Zap, Thermometer } from "lucide-react";

export function Dashboard() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Vue d'ensemble de la micro-usine</p>
        </div>
        <Badge className="bg-green-500 text-white text-sm px-4 py-2">
          Système Opérationnel
        </Badge>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Uptime
            </CardTitle>
            <Activity className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24h 15m</div>
            <p className="text-xs text-slate-500 mt-1">Depuis le démarrage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              CPU Raspberry Pi
            </CardTitle>
            <Cpu className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42%</div>
            <Progress value={42} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Température
            </CardTitle>
            <Thermometer className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38°C</div>
            <p className="text-xs text-slate-500 mt-1">Température ambiante</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Actions
            </CardTitle>
            <Zap className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-slate-500 mt-1">Total effectuées</p>
          </CardContent>
        </Card>
      </div>

      {/* Hands Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HandStatus
          hand="left"
          status="active"
          position={{ x: 45, y: 120, z: 80 }}
          grip={75}
        />
        <HandStatus
          hand="right"
          status="active"
          position={{ x: -30, y: 115, z: 78 }}
          grip={60}
        />
      </div>

      {/* Sensors and Activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <SensorGrid />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
