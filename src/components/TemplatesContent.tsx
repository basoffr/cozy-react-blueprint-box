
import { Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const templateData = [
  {
    name: "wa",
    subject: "jalajfd",
    createdAt: "Aangemaakt op 2025-05-07 11:57:04"
  }
];

export function TemplatesContent() {
  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <nav className="text-sm text-gray-500 mb-2">Templates</nav>
          <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Nieuwe template aanmaken
          </Button>
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

      {/* Templates List */}
      <div className="space-y-4">
        {templateData.map((template, index) => (
          <Card key={index} className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {template.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{template.subject}</p>
                  <p className="text-sm text-gray-500">{template.createdAt}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Bewerken
                  </Button>
                  <Button variant="outline" size="sm">
                    Verwijderen
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
