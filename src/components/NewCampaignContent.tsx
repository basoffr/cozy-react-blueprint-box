
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useNewCampaign } from "@/contexts/NewCampaignContext";
import { templatesApi } from "@/services/templatesApi";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

export const NewCampaignContent = () => {
  const navigate = useNavigate();
  const { templateId, setTemplateId } = useNewCampaign();
  const [selectedTemplate, setSelectedTemplate] = useState<string>(templateId || "");

  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates-sequences'],
    queryFn: () => templatesApi.getList(1, 100), // Get all templates for selection
  });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setTemplateId(templateId);
  };

  const handleNext = () => {
    if (!selectedTemplate) {
      toast.error("Please select a sequence template");
      return;
    }
    
    navigate("/campaigns/new/leads");
  };

  const handleBack = () => {
    navigate("/campaigns");
  };

  return (
    <div className="p-8">
      {/* Header with breadcrumb */}
      <div className="mb-8">
        <div className="text-sm text-gray-500 mb-2">
          Campaigns/Nieuwe Campagne/Sequence Kiezen
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
            <span className="ml-2 text-sm font-medium text-blue-600">Sequence kiezen</span>
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

      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Stap 1: Kies een sequence template</h2>
          
          {isLoading ? (
            <div className="text-center py-8">Loading templates...</div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Beschikbare sequences</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates?.map((template: any) => (
                      <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <RadioGroupItem value={template.id} id={template.id} className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor={template.id} className="font-medium text-gray-900 cursor-pointer">
                              {template.name || 'Unnamed Template'}
                            </Label>
                            <div className="text-sm text-gray-600 mt-1">
                              {template.subject || 'No subject'}
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              Aangemaakt: {new Date(template.created_at || new Date()).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            Terug naar campaigns
          </Button>
          <Button 
            className={cn(
              "bg-blue-600 hover:bg-blue-700",
              !selectedTemplate && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleNext}
            disabled={!selectedTemplate}
          >
            Volgende stap
          </Button>
        </div>
      </div>
    </div>
  );
};
