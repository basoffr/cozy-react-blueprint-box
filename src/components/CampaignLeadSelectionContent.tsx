
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useNewCampaign } from "@/contexts/NewCampaignContext";
import { leadsApi } from "@/services/api";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

export const CampaignLeadSelectionContent = () => {
  const navigate = useNavigate();
  const { listId, setListId } = useNewCampaign();
  const [selectedList, setSelectedList] = useState<string>(listId || "");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [newListName, setNewListName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { data: leadLists, isLoading, refetch } = useQuery({
    queryKey: ['leads-lists'],
    queryFn: leadsApi.getLists,
  });

  const handleListSelect = (listId: string) => {
    setSelectedList(listId);
    setListId(listId);
  };

  const handleUploadNewList = async () => {
    if (!uploadFile || !newListName.trim()) {
      toast.error("Please select a file and enter a list name");
      return;
    }

    if (!uploadFile.name.toLowerCase().endsWith('.csv')) {
      toast.error("Please select a valid CSV file");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('list_name', newListName.trim());

      await leadsApi.import(uploadFile);
      
      toast.success("List uploaded successfully");
      
      // Reset upload form
      setUploadFile(null);
      setNewListName("");
      
      // Refresh the lists and auto-select the new one
      await refetch();
      
      // Note: In a real app, the API would return the new list ID
      // For now, we'll just show success
      
    } catch (error: any) {
      console.error('List upload error:', error);
      toast.error(error.message || "Failed to upload list");
    } finally {
      setIsUploading(false);
    }
  };

  const handleNext = () => {
    if (!selectedList) {
      toast.error("Please select a lead list");
      return;
    }
    
    navigate("/campaigns/new/confirm");
  };

  const handlePrevious = () => {
    navigate("/campaigns/new");
  };

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
              {isLoading ? (
                <div className="text-center py-4">Loading lead lists...</div>
              ) : (
                <RadioGroup value={selectedList} onValueChange={handleListSelect}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {leadLists?.map((list: any) => (
                      <div key={list.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <RadioGroupItem value={list.id.toString()} id={list.id.toString()} className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor={list.id.toString()} className="font-medium text-gray-900 cursor-pointer">
                              {list.name}
                            </Label>
                            <div className="text-sm text-gray-600 mt-1">
                              {list.lead_count || 0} leads
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              Aangemaakt: {new Date(list.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}
            </CardContent>
          </Card>

          {/* Upload New Leads */}
          <Card>
            <CardHeader>
              <CardTitle>Nieuwe leadlijst uploaden</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="newListName" className="text-sm font-medium text-gray-700">
                  Naam van nieuwe lijst
                </Label>
                <Input
                  id="newListName"
                  type="text"
                  placeholder="Voer naam in voor nieuwe lijst"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="uploadFile" className="text-sm font-medium text-gray-700">
                  CSV-bestand
                </Label>
                <Input
                  id="uploadFile"
                  type="file"
                  accept=".csv"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="mt-1"
                />
                {uploadFile && (
                  <p className="text-sm text-gray-500 mt-1">
                    Selected: {uploadFile.name}
                  </p>
                )}
              </div>
              <Button
                onClick={handleUploadNewList}
                disabled={isUploading || !uploadFile || !newListName.trim()}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isUploading ? "Uploading..." : "Upload nieuwe lijst"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious}>
            Vorige stap
          </Button>
          <Button 
            className={cn(
              "bg-blue-600 hover:bg-blue-700",
              !selectedList && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleNext}
            disabled={!selectedList}
          >
            Volgende stap
          </Button>
        </div>
      </div>
    </div>
  );
};
