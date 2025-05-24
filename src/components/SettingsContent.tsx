
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SettingsContent() {
  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <nav className="text-sm text-gray-500 mb-2">Instellingen</nav>
          <h1 className="text-2xl font-bold text-gray-900">Instellingen</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <Bell className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Administrator</span>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Form */}
      <div className="max-w-2xl space-y-6">
        <div>
          <Label htmlFor="smtp-server" className="text-sm font-medium text-gray-700">
            SMTP-server
          </Label>
          <Input
            id="smtp-server"
            defaultValue="smtp.example.com"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="smtp-port" className="text-sm font-medium text-gray-700">
            SMTP-poort
          </Label>
          <Input
            id="smtp-port"
            defaultValue="587"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="email-sender" className="text-sm font-medium text-gray-700">
            E-mailadres (afzender)
          </Label>
          <Input
            id="email-sender"
            defaultValue="jij@example.com"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="send-delay" className="text-sm font-medium text-gray-700">
            Verzendvertraging (seconden)
          </Label>
          <Input
            id="send-delay"
            defaultValue="300"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="batch-size" className="text-sm font-medium text-gray-700">
            Standaard batchgrootte
          </Label>
          <Input
            id="batch-size"
            defaultValue="10"
            className="mt-1"
          />
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
          Instellingen opslaan
        </Button>
      </div>
    </div>
  );
}
