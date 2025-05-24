
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Users, Calendar } from "lucide-react";

export const CampaignConfirmationContent = () => {
  return (
    <div className="p-8">
      {/* Header with breadcrumb */}
      <div className="mb-8">
        <div className="text-sm text-gray-500 mb-2">
          Campaigns/Nieuwe Campagne/Bevestigen
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
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              2
            </div>
            <span className="ml-2 text-sm font-medium text-green-600">Leads selecteren</span>
          </div>
          <div className="w-8 h-px bg-green-600"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              3
            </div>
            <span className="ml-2 text-sm font-medium text-blue-600">Bevestigen</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Stap 3: Campagne bevestigen</h2>
          
          <h3 className="text-lg font-medium text-gray-900 mb-4">Samenvatting van uw campagne</h3>

          <div className="space-y-6">
            {/* Template */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <Mail className="h-5 w-5 mr-2" />
                  Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Onderwerp:</span>
                    <span className="font-medium">wa</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leads */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <Users className="h-5 w-5 mr-2" />
                  Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lijst:</span>
                    <span className="font-medium">test</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Aantal leads:</span>
                    <span className="font-medium">223</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Planning */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <Calendar className="h-5 w-5 mr-2" />
                  Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Verzendmethode:</span>
                    <span className="font-medium">Direct verzenden</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between">
          <Button variant="outline">Terug naar stap 2</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Bevestigen en campagne aanmaken</Button>
        </div>
      </div>
    </div>
  );
};
