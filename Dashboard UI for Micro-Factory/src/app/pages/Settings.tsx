import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import {
  Save,
  RefreshCw,
  Wifi,
  Camera,
  Bell,
  Shield,
  Zap,
} from "lucide-react";

export function Settings() {
  const [apiUrl, setApiUrl] = useState("http://192.168.1.100:8000");
  const [notifications, setNotifications] = useState(true);
  const [autoReconnect, setAutoReconnect] = useState(true);
  const [debugMode, setDebugMode] = useState(false);

  const handleSave = () => {
    toast.success("Paramètres sauvegardés avec succès");
  };

  const handleReset = () => {
    toast.info("Paramètres réinitialisés");
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Paramètres</h1>
        <p className="text-slate-600 mt-1">
          Configuration du système et de la connexion
        </p>
      </div>

      {/* Connection Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wifi className="size-5 text-blue-500" />
            <CardTitle>Connexion API</CardTitle>
          </div>
          <CardDescription>
            Configurez la connexion au Raspberry Pi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="api-url">URL de l'API</Label>
            <Input
              id="api-url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://192.168.1.100:8000"
              className="mt-2"
            />
            <p className="text-xs text-slate-500 mt-1">
              Adresse IP et port du Raspberry Pi
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-reconnect">Reconnexion automatique</Label>
              <p className="text-xs text-slate-500 mt-1">
                Tenter de se reconnecter en cas de perte de connexion
              </p>
            </div>
            <Switch
              id="auto-reconnect"
              checked={autoReconnect}
              onCheckedChange={setAutoReconnect}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-green-900">
                Connecté au Raspberry Pi
              </span>
            </div>
            <Badge className="bg-green-500">En ligne</Badge>
          </div>

          <Button variant="outline" className="w-full">
            <RefreshCw className="size-4 mr-2" />
            Tester la connexion
          </Button>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="size-5 text-yellow-500" />
            <CardTitle>Système</CardTitle>
          </div>
          <CardDescription>
            Paramètres généraux du système
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications">Notifications</Label>
              <p className="text-xs text-slate-500 mt-1">
                Recevoir des notifications pour les événements importants
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="debug-mode">Mode debug</Label>
              <p className="text-xs text-slate-500 mt-1">
                Afficher les informations de débogage détaillées
              </p>
            </div>
            <Switch
              id="debug-mode"
              checked={debugMode}
              onCheckedChange={setDebugMode}
            />
          </div>
        </CardContent>
      </Card>

      {/* Camera Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Camera className="size-5 text-purple-500" />
            <CardTitle>Caméra</CardTitle>
          </div>
          <CardDescription>
            Configuration de la caméra de surveillance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Résolution</Label>
            <select className="w-full mt-2 p-2 border rounded-lg">
              <option>1920x1080 (Full HD)</option>
              <option>1280x720 (HD)</option>
              <option>640x480 (VGA)</option>
            </select>
          </div>

          <div>
            <Label>Framerate</Label>
            <select className="w-full mt-2 p-2 border rounded-lg">
              <option>30 FPS</option>
              <option>60 FPS</option>
              <option>15 FPS</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Safety Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-red-500" />
            <CardTitle>Sécurité</CardTitle>
          </div>
          <CardDescription>
            Paramètres de sécurité et limites du système
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Force maximale de préhension (%)</Label>
            <Input type="number" defaultValue="80" className="mt-2" />
            <p className="text-xs text-slate-500 mt-1">
              Limite de sécurité pour éviter d'endommager le smartphone
            </p>
          </div>

          <div>
            <Label>Timeout d'action (secondes)</Label>
            <Input type="number" defaultValue="30" className="mt-2" />
            <p className="text-xs text-slate-500 mt-1">
              Temps maximum d'exécution avant arrêt automatique
            </p>
          </div>

          <Separator />

          <Button variant="destructive" className="w-full">
            <Bell className="size-4 mr-2" />
            Arrêt d'urgence
          </Button>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={handleSave} className="flex-1">
          <Save className="size-4 mr-2" />
          Sauvegarder les paramètres
        </Button>
        <Button onClick={handleReset} variant="outline" className="flex-1">
          <RefreshCw className="size-4 mr-2" />
          Réinitialiser
        </Button>
      </div>
    </div>
  );
}
