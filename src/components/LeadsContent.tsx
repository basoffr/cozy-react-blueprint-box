
import { useState } from "react";
import { Bell, Search, Filter, Users, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LeadEditDialog } from "./LeadEditDialog";
import { useLeads } from "@/hooks/useLeads";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from '@/integrations/supabase/types';

type Lead = Tables<'leads'>;

export function LeadsContent() {
  const { leads, isLoading, error, refetch } = useLeads();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLeads = leads.filter(lead => 
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.bedrijf && lead.bedrijf.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    const { data } = supabase.storage.from('lead-images').getPublicUrl(imagePath);
    return data.publicUrl;
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsEditDialogOpen(true);
  };

  const handleLeadUpdated = () => {
    refetch();
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          Error loading leads: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <nav className="text-sm text-gray-500 mb-2">Leads</nav>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Users className="h-4 w-4 mr-2" />
            Leads importeren
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

      {/* Controls */}
      <div className="flex items-center gap-4 mb-6">
        <div className="text-sm text-gray-600">
          <span className="font-semibold">Leads {leads.length}</span>
        </div>
        <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option>Alle lijsten ({leads.length})</option>
        </select>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Zoek e-mail, naam..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input type="checkbox" className="rounded" />
              </TableHead>
              <TableHead className="text-blue-600">E-mail</TableHead>
              <TableHead className="text-blue-600">Naam</TableHead>
              <TableHead className="text-blue-600">Bedrijf</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>LinkedIn</TableHead>
              <TableHead className="text-blue-600">Datum toegevoegd</TableHead>
              <TableHead>Afbeelding</TableHead>
              <TableHead>Anders</TableHead>
              <TableHead>Acties</TableHead>
              <TableHead className="w-12">
                <Plus className="h-4 w-4" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Skeleton loading rows
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))
            ) : (
              filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <input type="checkbox" className="rounded" />
                  </TableCell>
                  <TableCell className="text-blue-600">{lead.email}</TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>{lead.bedrijf || "—"}</TableCell>
                  <TableCell>
                    {lead.website ? (
                      <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Website
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    {lead.linkedin ? (
                      <a href={lead.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        LinkedIn
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(lead.created_at).toLocaleDateString('nl-NL')}
                  </TableCell>
                  <TableCell>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={getImageUrl(lead.image_path) || undefined} />
                      <AvatarFallback className="bg-gray-800 text-white text-xs">
                        {lead.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditLead(lead)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Bewerken
                    </Button>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <LeadEditDialog
        lead={selectedLead}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onLeadUpdated={handleLeadUpdated}
      />
    </div>
  );
}
