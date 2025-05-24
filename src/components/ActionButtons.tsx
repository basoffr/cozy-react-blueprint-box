
import { Button } from "@/components/ui/button";
import { Upload, Send, Users } from "lucide-react";

export function ActionButtons() {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <Button 
        variant="outline" 
        className="w-full max-w-xs bg-white border-2 border-blue-200 text-blue-600 hover:bg-blue-50 py-6"
      >
        <Upload className="h-5 w-5 mr-2" />
        Upload
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full max-w-xs bg-white border-2 border-blue-200 text-blue-600 hover:bg-blue-50 py-6"
      >
        <Send className="h-5 w-5 mr-2" />
        Campagne
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full max-w-xs bg-white border-2 border-blue-200 text-blue-600 hover:bg-blue-50 py-6"
      >
        <Users className="h-5 w-5 mr-2" />
        Leads
      </Button>
    </div>
  );
}
