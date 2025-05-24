import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const leadLists = [
  {
    id: 1,
    name: "test",
    leads: 223,
    createdAt: "2025-05-12 13:23:49",
  },
  {
    id: 2,
    name: "test",
    leads: 0,
    createdAt: "2025-05-12 13:08:54",
  },
  {
    id: 3,
    name: "test",
    leads: 0,
    createdAt: "2025-05-12 13:07:04",
  },
  {
    id: 4,
    name: "test",
    leads: 0,
    createdAt: "2025-05-12 13:04:46",
  },
  {
    id: 5,
    name: "test",
    leads: 0,
    createdAt: "2025-05-12 12:51:48",
  },
  {
    id: 6,
    name: "test",
    leads: 0,
    createdAt: "2025-05-12 12:48:57",
  },
  {
    id: 7,
    name: "propa",
    leads: 0,
    createdAt: "2025-05-12 08:26:51",
  },
  {
    id: 8,
    name: "jala",
    leads: 0,
    createdAt: "2025-05-09 08:06:13",
  },
  {
    id: 9,
    name: "Jala",
    leads: 0,
    createdAt: "2025-05-09 08:01:27",
  },
  {
    id: 10,
    name: "Jala",
    leads: 0,
    createdAt: "2025-05-07 11:57:12",
  },
];

export const CampaignLeadSelectionContent = () => {
  return (
    <div className="p-8">
      {/* Header with breadcrumb */}
      <div className="mb-8">
        <div className="text-sm text-gray-500 mb-2">
          Campaigns/Nieuwe Campagne/Leads Selecteren
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Nieuwe campagne aanmaken</h1>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-8">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              1
            </div>
            <span className="ml-2 text-sm font-medium text-green-600">Template kiezen</span>
          </div>
          <div className="w-8 h-px bg-green-600"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              2
            </div>
            <span className="ml-2 text-sm font-medium text-blue-600">Leads selecteren</span>
          </div>
          <div className="w-8 h-px bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
              3
            </div>
            <span className="ml-2 text-sm text-gray-500">Bevestigen</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Stap 2: Leads selecteren</h2>
          
          {/* Existing Lead Lists */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Bestaande leadlijsten</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {leadLists.map((list) => (
                    <div key={list.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value={list.id.toString()} id={list.id.toString()} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={list.id.toString()} className="font-medium text-gray-900 cursor-pointer">
                            {list.name}
                          </Label>
                          <div className="text-sm text-gray-600 mt-1">
                            {list.leads} leads
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            Aangemaakt: {list.createdAt}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Upload New Leads */}
          <Card>
            <CardHeader>
              <CardTitle>Nieuwe leads uploaden</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upload" id="upload" />
                <Label htmlFor="upload">CSV-bestand met leads uploaden</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between">
          <Button variant="outline">Vorige stap</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Volgende stap</Button>
        </div>
      </div>
    </div>
  );
};
