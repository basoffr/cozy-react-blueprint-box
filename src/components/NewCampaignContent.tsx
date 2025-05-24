import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const NewCampaignContent = () => {
  return (
    <div className="p-8">
      {/* Header with breadcrumb */}
      <div className="mb-8">
        <div className="text-sm text-gray-500 mb-2">
          Campaigns/Nieuwe Campagne
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Nieuwe campagne aanmaken</h1>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-8">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              1
            </div>
            <span className="ml-2 text-sm font-medium text-blue-600">Template kiezen</span>
          </div>
          <div className="w-8 h-px bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
              2
            </div>
            <span className="ml-2 text-sm text-gray-500">Leads selecteren</span>
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

      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Stap 1: Kies een template</h2>
          
          {/* Existing Templates */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Bestaande templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <input type="radio" name="template" className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium">Template #1</div>
                    <div className="text-sm text-gray-500 mt-1">jalajfd</div>
                    <div className="text-sm text-gray-400 mt-1">2025-05-07 11:57:04</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New Template */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Nieuwe template aanmaken</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue="new">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="new" />
                  <Label htmlFor="new">Nieuwe template aanmaken</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Planning */}
          <Card>
            <CardHeader>
              <CardTitle>Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="send-time">Wanneer verzenden?</Label>
                  <Select>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Nu verzenden" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now">Nu verzenden</SelectItem>
                      <SelectItem value="later">Later verzenden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between">
          <Button variant="outline">Annuleren</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Volgende stap</Button>
        </div>
      </div>
    </div>
  );
};
