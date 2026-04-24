import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Hand,
  Play,
  Square,
  Smartphone,
  MessageSquare,
} from "lucide-react";

export function Control() {
  const [autoMode, setAutoMode] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [gripStrength, setGripStrength] = useState([50]);
  const [speed, setSpeed] = useState([50]);

  // ✅ API CALL
  const sendAction = async (action: any) => {
    try {
      await fetch("https://localhost:7124/api/robot/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(action),
      });

      console.log("✅ envoyé:", action);
    } catch (err) {
      console.error("❌ erreur:", err);
    }
  };

  // ✅ ACTION HANDLER
  const handleAction = (id: string) => {
    switch (id) {
      case "tap":
        sendAction({ type: "tap" });
        break;

      case "double-tap":
        sendAction({ type: "tap" });
        sendAction({ type: "tap" });
        break;

      case "scroll-up":
        sendAction({ type: "swipe", direction: "up" });
        break;

      case "scroll-down":
        sendAction({ type: "swipe", direction: "down" });
        break;

      case "swipe-left":
        sendAction({ type: "swipe", direction: "left" });
        break;

      case "swipe-right":
        sendAction({ type: "swipe", direction: "right" });
        break;
    }

    toast.success("Action envoyée 🚀");
  };

  // ✅ ACTIONS
  const quickActions = [
    { id: "scroll-up", label: "Scroll Haut", icon: ArrowUp, color: "bg-blue-500" },
    { id: "scroll-down", label: "Scroll Bas", icon: ArrowDown, color: "bg-blue-500" },
    { id: "swipe-left", label: "Swipe Gauche", icon: ArrowLeft, color: "bg-purple-500" },
    { id: "swipe-right", label: "Swipe Droite", icon: ArrowRight, color: "bg-purple-500" },
    { id: "tap", label: "Tap", icon: Hand, color: "bg-green-500" },
    { id: "double-tap", label: "Double Tap", icon: Hand, color: "bg-green-600" },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Contrôle</h1>
          <p className="text-slate-600 mt-1">
            Pilotage manuel et automatique de la micro-usine
          </p>
        </div>

        <Button
          size="lg"
          onClick={() => {
            setIsRunning(!isRunning);
            sendAction({ type: "scenario", scenario: isRunning ? "stop" : "start" });
          }}
        >
          {isRunning ? "Arrêter" : "Démarrer"}
        </Button>
      </div>

      {/* QUICK ACTIONS */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className="h-24 flex flex-col gap-2"
                  onClick={() => handleAction(action.id)} // ✅ FIX HERE
                >
                  <div className={`${action.color} p-3 rounded-lg text-white`}>
                    <Icon className="size-6" />
                  </div>
                  <span className="text-xs">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* SLIDERS */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <Label>Force</Label>
            <Slider
              value={gripStrength}
              onValueChange={(val) => {
                setGripStrength(val);
                sendAction({ type: "speed", value: val[0] }); // ✅
              }}
            />
          </div>

          <div>
            <Label>Vitesse</Label>
            <Slider
              value={speed}
              onValueChange={(val) => {
                setSpeed(val);
                sendAction({ type: "speed", value: val[0] }); // ✅
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}