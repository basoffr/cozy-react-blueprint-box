
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LeadsImportContent() {
  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <nav className="text-sm text-gray-500 mb-2">Leads/Importeren</nav>
          <h1 className="text-2xl font-bold text-gray-900">Leads importeren</h1>
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

      {/* Import Forms */}
      <div className="max-w-4xl space-y-8">
        {/* Regular CSV Upload */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Leads importeren
            </CardTitle>
            <p className="text-sm text-gray-600">Reguliere CSV Upload</p>
            <p className="text-sm text-gray-500">Naam van leadlijst</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">CSV-bestand</Label>
              <div className="mt-2 flex items-center gap-2">
                <Button variant="outline" size="sm">Bestand kiezen</Button>
                <span className="text-sm text-gray-500">Geen bestand gekozen</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Minimaal vereist: kolom 'email'. Optioneel: name, company, function, website.
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Uploaden
              </Button>
              <Button variant="outline">
                Annuleren
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Import */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Bulk Import
            </CardTitle>
            <p className="text-sm text-gray-600">
              Gebruik deze opties om leads en afbeeldingen apart te uploaden.
            </p>
            <p className="text-sm text-gray-500">Kolomnaam voor Image URL (optioneel)</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="image_url"
              className="max-w-md"
            />
            <p className="text-sm text-gray-500">
              Geef de kolomnaam op in je CSV die directe afbeeldings-URL's bevat.
            </p>
            <div className="flex gap-2">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Upload Leads CSV
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Upload Afbeeldingen ZIP
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              <strong>Let op:</strong> Voor het koppelen van afbeeldingen aan leads moet je eerst de leads uploaden en daarna de ZIP met afbeeldingen.
            </p>
          </CardContent>
        </Card>

        {/* Import Images Only */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Alleen afbeeldingen importeren
            </CardTitle>
            <p className="text-sm text-gray-600">
              Upload alleen een ZIP met afbeeldingsbestanden en koppel ze automatisch aan bestaande leads op basis van website.
            </p>
            <p className="text-sm text-gray-500">Upload alleen afbeeldingen (ZIP)</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Bestand kiezen</Button>
              <span className="text-sm text-gray-500">Geen bestand gekozen</span>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Importeer alleen afbeeldingen
            </Button>
            <p className="text-sm text-gray-600">
              <strong>Tip:</strong> Zorg dat de bestandsnamen in de ZIP overeenkomen met de domeinnaam van de lead (bijv. 'abcorinstallateur.nl.png' voor website 'https://abcorinstallateur.nl/').
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
