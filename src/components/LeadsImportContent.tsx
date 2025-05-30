import { Bell, Upload, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import Papa from "papaparse";
import { supabase } from "@/integrations/supabase/client";
import { useNavigateBack } from "@/hooks/useNavigateBack";

interface CSVRow {
  email: string;
  bedrijf?: string;
  website?: string;
  linkedin?: string;
  image_path?: string;
}

export function LeadsImportContent() {
  const navigate = useNavigate();
  const navigateBack = useNavigateBack("/leads");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [csvProcessing, setCsvProcessing] = useState(false);
  const [zipProcessing, setZipProcessing] = useState(false);
  const [csvProgress, setCsvProgress] = useState(0);
  const [zipProgress, setZipProgress] = useState(0);
  const [csvComplete, setCsvComplete] = useState(false);
  const [zipComplete, setZipComplete] = useState(false);
  const [csvResults, setCsvResults] = useState<{ imported: number; duplicates: number } | null>(null);
  const [zipResults, setZipResults] = useState<{ count: number; duplicates: number } | null>(null);

  const handleCsvUpload = async () => {
    if (!csvFile) {
      toast.error("Please select a CSV file");
      return;
    }

    setCsvProcessing(true);
    setCsvProgress(0);

    try {
      // Parse CSV file
      Papa.parse(csvFile, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          console.log('CSV parsed:', results.data);
          setCsvProgress(30);

          const rows = results.data as CSVRow[];
          
          // Filter valid rows (must have email)
          const validRows = rows.filter(row => row.email && row.email.trim());
          
          if (validRows.length === 0) {
            throw new Error("No valid rows found in CSV. Make sure there's an 'email' column.");
          }

          setCsvProgress(60);

          // Prepare data for insertion
          const leadsData = validRows.map(row => ({
            email: row.email.trim(),
            bedrijf: row.bedrijf?.trim() || null,
            website: row.website?.trim() || null,
            linkedin: row.linkedin?.trim() || null,
            image_path: row.image_path?.trim() || null,
          }));

          // Insert into Supabase
          const { data, error } = await supabase
            .from('leads')
            .insert(leadsData)
            .select();

          setCsvProgress(90);

          if (error) {
            // Handle duplicate key errors gracefully
            if (error.code === '23505') {
              toast.error("Some leads already exist. Please check for duplicates.");
            } else {
              throw error;
            }
          }

          setCsvProgress(100);
          setCsvComplete(true);
          setCsvResults({ 
            imported: data?.length || 0, 
            duplicates: validRows.length - (data?.length || 0)
          });
          
          toast.success(`CSV imported successfully! ${data?.length || 0} leads added.`);
        },
        error: (error) => {
          throw new Error(`CSV parsing error: ${error.message}`);
        }
      });
    } catch (error: any) {
      console.error('CSV upload error:', error);
      toast.error(error.message || "Failed to import CSV");
      setCsvProgress(0);
    } finally {
      setCsvProcessing(false);
    }
  };

  const handleZipUpload = async () => {
    if (!zipFile) {
      toast.error("Please select a ZIP file");
      return;
    }

    if (zipFile.size > 50 * 1024 * 1024) {
      toast.error("ZIP file must be less than 50MB");
      return;
    }

    setZipProcessing(true);
    setZipProgress(0);

    try {
      setZipProgress(20);

      // Create FormData and send to edge function
      const formData = new FormData();
      formData.append('file', zipFile);

      setZipProgress(40);

      const { data, error } = await supabase.functions.invoke('import_avatars', {
        body: zipFile,
        headers: {
          'Content-Type': 'application/zip',
        },
      });

      setZipProgress(80);

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Unknown error occurred');
      }

      setZipProgress(100);
      setZipComplete(true);
      setZipResults({ 
        count: data.count, 
        duplicates: data.duplicates 
      });
      
      toast.success(`Avatars uploaded successfully! ${data.count} files processed.`);

      if (data.errors && data.errors.length > 0) {
        console.warn('Some files had errors:', data.errors);
        toast.error(`${data.errors.length} files had errors. Check console for details.`);
      }
    } catch (error: any) {
      console.error('ZIP upload error:', error);
      toast.error(error.message || "Failed to import avatars");
      setZipProgress(0);
    } finally {
      setZipProcessing(false);
    }
  };

  const handleFinish = () => {
    toast.success("Leads & avatars imported successfully!", {
      duration: 3000,
    });
    navigate("/leads");
  };

  const canFinish = csvComplete && zipComplete;

  return (
    <div className="p-6">
      {/* Header with back button */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
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
            <nav className="text-sm text-gray-500 mb-2">Leads/Bulk Import</nav>
            <h1 className="text-2xl font-bold text-gray-900">Bulk Import Leads & Avatars</h1>
          </div>
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
      <div className="max-w-4xl space-y-6">
        {/* Step 1: CSV Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {csvComplete ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-bold">
                  1
                </div>
              )}
              Upload CSV with Lead Data
            </CardTitle>
            <p className="text-sm text-gray-600">
              Upload a CSV file with columns: email (required), bedrijf, website, linkedin, image_path
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="csvFile" className="text-sm font-medium text-gray-700">
                CSV File (max 5MB)
              </Label>
              <Input
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                className="mt-1"
                disabled={csvProcessing || csvComplete}
              />
              {csvFile && (
                <p className="text-sm text-gray-500 mt-1">
                  Selected: {csvFile.name} ({(csvFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
            
            {csvProcessing && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Processing CSV...
                </Label>
                <Progress value={csvProgress} className="w-full" />
                <p className="text-sm text-gray-500">{csvProgress}% complete</p>
              </div>
            )}

            {csvComplete && csvResults && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">
                  ✅ CSV processed: {csvResults.imported} leads imported
                  {csvResults.duplicates > 0 && `, ${csvResults.duplicates} duplicates skipped`}
                </p>
              </div>
            )}

            <Button
              onClick={handleCsvUpload}
              disabled={csvProcessing || !csvFile || csvComplete}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {csvProcessing ? "Processing..." : csvComplete ? "CSV Imported ✓" : "Import CSV"}
            </Button>
          </CardContent>
        </Card>

        {/* Step 2: ZIP Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {zipComplete ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-bold">
                  2
                </div>
              )}
              Upload ZIP with Avatar Images
            </CardTitle>
            <p className="text-sm text-gray-600">
              Upload a ZIP file containing avatar images in an "avatars/" folder (e.g., avatars/user1.png)
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="zipFile" className="text-sm font-medium text-gray-700">
                ZIP File (max 50MB)
              </Label>
              <Input
                id="zipFile"
                type="file"
                accept=".zip"
                onChange={(e) => setZipFile(e.target.files?.[0] || null)}
                className="mt-1"
                disabled={zipProcessing || zipComplete}
              />
              {zipFile && (
                <p className="text-sm text-gray-500 mt-1">
                  Selected: {zipFile.name} ({(zipFile.size / 1024 / 1024).toFixed(1)} MB)
                </p>
              )}
            </div>
            
            {zipProcessing && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Uploading Avatars...
                </Label>
                <Progress value={zipProgress} className="w-full" />
                <p className="text-sm text-gray-500">{zipProgress}% complete</p>
              </div>
            )}

            {zipComplete && zipResults && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">
                  ✅ ZIP processed: {zipResults.count} avatars uploaded
                  {zipResults.duplicates > 0 && `, ${zipResults.duplicates} duplicates replaced`}
                </p>
              </div>
            )}

            <Button
              onClick={handleZipUpload}
              disabled={zipProcessing || !zipFile || zipComplete}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {zipProcessing ? "Uploading..." : zipComplete ? "ZIP Imported ✓" : "Import ZIP"}
            </Button>
          </CardContent>
        </Card>

        {/* Finish Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {canFinish ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-bold">
                  3
                </div>
              )}
              Complete Import
            </CardTitle>
            <p className="text-sm text-gray-600">
              {canFinish 
                ? "Both CSV and ZIP have been processed successfully. Click finish to view your leads."
                : "Complete both CSV and ZIP uploads to finish the import process."
              }
            </p>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleFinish}
              disabled={!canFinish}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {canFinish ? "Finish & View Leads" : "Complete Steps 1 & 2 First"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
