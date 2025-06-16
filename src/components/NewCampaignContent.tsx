
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useNewCampaign } from "@/contexts/NewCampaignContext";
import { templatesApi } from "@/services/api";
import { toast } from "@/components/ui/sonner";
import { format } from "date-fns";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigateBack } from "@/hooks/useNavigateBack";

export const NewCampaignContent = () => {
  const navigate = useNavigate();
  const navigateBack = useNavigateBack("/campaigns");
  const { templateId, setTemplateId, scheduleAt, setScheduleAt } = useNewCampaign();
  const [selectedTemplate, setSelectedTemplate] = useState<string>(templateId || "");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    scheduleAt ? new Date(scheduleAt) : undefined
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    scheduleAt ? format(new Date(scheduleAt), "HH:mm") : "09:00"
  );

  const { data, isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: () => templatesApi.getAll(),
  });
  
  // Safely extract templates array from response
  const templates = data?.items ?? [];

  const handlePreview = async (templateId: string) => {
    try {
      await templatesApi.preview(templateId);
      toast.success("Template preview loaded");
    } catch (error: any) {
      console.error('Preview error:', error);
      // Error handling is done in the API service
    }
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    setTemplateId(template);
  };

  const handleDateTimeChange = () => {
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(':');
      const scheduledDate = new Date(selectedDate);
      scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setScheduleAt(scheduledDate.toISOString());
    }
  };

  const handleNext = () => {
    if (!selectedTemplate) {
      toast.error("Please select a template");
      return;
    }
    
    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time");
      return;
    }

    handleDateTimeChange();
    navigate("/campaigns/new/leads");
  };

  const canProceed = selectedTemplate && selectedDate && selectedTime;

  return (
    <div className="p-8">
      {/* Header with breadcrumb and back button */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={navigateBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Terug
          </Button>
          <div>
            <div className="text-sm text-gray-500 mb-2">
              Campaigns/Nieuwe Campagne
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Nieuwe campagne aanmaken</h1>
          </div>
        </div>
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
              {isLoading ? (
                <div className="text-center py-4">Loading templates...</div>
              ) : templates.length === 0 ? (
                <div className="text-center py-4">No templates available</div>
              ) : (
                <RadioGroup
                  value={selectedTemplate}
                  onValueChange={handleTemplateSelect}
                  className="space-y-2"
                >
                  <div className="space-y-4">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className={cn(
                          "border rounded-lg p-4 transition-all",
                          selectedTemplate === template.id
                            ? "border-blue-600 bg-blue-50"
                            : "hover:border-gray-400"
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-3">
                            <RadioGroupItem value={template.id} id={template.id} />
                            <div>
                              <Label
                                htmlFor={template.id}
                                className="text-base font-medium cursor-pointer"
                              >
                                {template.name}
                              </Label>
                              <div className="text-sm text-gray-500 mt-1">{template.subject}</div>
                              <div className="text-sm text-gray-400 mt-1">
                                {new Date(template.created_at).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreview(template.id)}
                          >
                            Preview
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}
            </CardContent>
          </Card>

          {/* Planning */}
          <Card>
            <CardHeader>
              <CardTitle>Planning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Selecteer datum</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Selecteer een datum"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        if (date && selectedTime) {
                          const [hours, minutes] = selectedTime.split(':');
                          const scheduledDate = new Date(date);
                          scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                          setScheduleAt(scheduledDate.toISOString());
                        }
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="time">Selecteer tijd</Label>
                <Input
                  id="time"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => {
                    setSelectedTime(e.target.value);
                    if (selectedDate && e.target.value) {
                      const [hours, minutes] = e.target.value.split(':');
                      const scheduledDate = new Date(selectedDate);
                      scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                      setScheduleAt(scheduledDate.toISOString());
                    }
                  }}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={navigateBack}>
            Annuleren
          </Button>
          <Button 
            className={cn(
              "bg-blue-600 hover:bg-blue-700",
              !canProceed && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleNext}
            disabled={!canProceed}
          >
            Volgende stap
          </Button>
        </div>
      </div>
    </div>
  );
};
