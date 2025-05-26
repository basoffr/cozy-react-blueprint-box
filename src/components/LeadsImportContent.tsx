
import { Bell, Upload, Link, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { leadsApi } from "@/services/api";

export function LeadsImportContent() {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [listName, setListName] = useState("");
  const [googleSheetUrl, setGoogleSheetUrl] = useState("");
  const [manualEmails, setManualEmails] = useState("");

  const handleCsvUpload = async () => {
    if (!csvFile || !listName.trim()) {
      toast.error("Please select a CSV file and enter a list name");
      return;
    }

    if (!csvFile.name.toLowerCase().endsWith('.csv')) {
      toast.error("Please select a valid CSV file");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', csvFile);
      formData.append('list_name', listName.trim());

      // Simulate progress for demo (in real app, this would track actual upload)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      await leadsApi.import(csvFile);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast.success("Leads imported successfully");
      
      // Reset form
      setCsvFile(null);
      setListName("");
      setUploadProgress(0);
      
      // Navigate to leads page
      navigate("/leads");
      
    } catch (error: any) {
      console.error('CSV upload error:', error);
      toast.error(error.message || "Failed to import leads");
    } finally {
      setIsUploading(false);
    }
  };

  const handleGoogleSheetImport = async () => {
    if (!googleSheetUrl.trim()) {
      toast.error("Please enter a Google Sheet URL");
      return;
    }

    toast.error("Google Sheet import not implemented yet");
  };

  const handleManualEntry = async () => {
    if (!manualEmails.trim()) {
      toast.error("Please enter email addresses");
      return;
    }

    toast.error("Manual entry not implemented yet");
  };

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

      {/* Import Wizard */}
      <div className="max-w-4xl">
        <Tabs defaultValue="csv" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="csv" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload CSV
            </TabsTrigger>
            <TabsTrigger value="googlesheet" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Google Sheet URL
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Manual Entry
            </TabsTrigger>
          </TabsList>

          <TabsContent value="csv">
            <Card>
              <CardHeader>
                <CardTitle>Upload CSV File</CardTitle>
                <p className="text-sm text-gray-600">
                  Upload a CSV file with leads. Required column: email. Optional: name, company, function, website.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="listName" className="text-sm font-medium text-gray-700">
                    Lead List Name
                  </Label>
                  <Input
                    id="listName"
                    type="text"
                    placeholder="Enter list name"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="csvFile" className="text-sm font-medium text-gray-700">
                    CSV File
                  </Label>
                  <Input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                    className="mt-1"
                  />
                  {csvFile && (
                    <p className="text-sm text-gray-500 mt-1">
                      Selected: {csvFile.name}
                    </p>
                  )}
                </div>
                
                {isUploading && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Upload Progress
                    </Label>
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-sm text-gray-500">{uploadProgress}% complete</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleCsvUpload}
                    disabled={isUploading || !csvFile || !listName.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isUploading ? "Uploading..." : "Upload CSV"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCsvFile(null);
                      setListName("");
                      setUploadProgress(0);
                    }}
                    disabled={isUploading}
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="googlesheet">
            <Card>
              <CardHeader>
                <CardTitle>Import from Google Sheet</CardTitle>
                <p className="text-sm text-gray-600">
                  Paste a Google Sheet URL to import leads directly from your spreadsheet.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="googleSheetUrl" className="text-sm font-medium text-gray-700">
                    Google Sheet URL
                  </Label>
                  <Input
                    id="googleSheetUrl"
                    type="url"
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    value={googleSheetUrl}
                    onChange={(e) => setGoogleSheetUrl(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={handleGoogleSheetImport}
                  disabled={!googleSheetUrl.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Import from Google Sheet
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual">
            <Card>
              <CardHeader>
                <CardTitle>Manual Entry</CardTitle>
                <p className="text-sm text-gray-600">
                  Enter email addresses manually, one per line.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="manualEmails" className="text-sm font-medium text-gray-700">
                    Email Addresses
                  </Label>
                  <Textarea
                    id="manualEmails"
                    placeholder="email1@example.com&#10;email2@example.com&#10;email3@example.com"
                    value={manualEmails}
                    onChange={(e) => setManualEmails(e.target.value)}
                    rows={8}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter one email address per line
                  </p>
                </div>
                <Button
                  onClick={handleManualEntry}
                  disabled={!manualEmails.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Import Emails
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
