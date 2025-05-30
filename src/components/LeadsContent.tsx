import { Bell, Plus, Upload } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { leadsApi } from "@/services/api";

export function LeadsContent() {
  const { data: leads, isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: () => leadsApi.getAll(),
  });

  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <nav className="text-sm text-gray-500 mb-2">Leads</nav>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link to="/leads/import">
              <Upload className="h-4 w-4 mr-2" />
              Leads importeren
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/leads/new">
              <Plus className="h-4 w-4 mr-2" />
              Nieuwe lead
            </Link>
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

      {/* Leads Table */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer">Email</TableHead>
                <TableHead className="cursor-pointer">Bedrijf</TableHead>
                <TableHead className="cursor-pointer">Website</TableHead>
                <TableHead className="cursor-pointer">LinkedIn</TableHead>
                <TableHead className="cursor-pointer">Avatar</TableHead>
                <TableHead>Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading leads...
                  </TableCell>
                </TableRow>
              ) : leads?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Geen leads gevonden
                  </TableCell>
                </TableRow>
              ) : (
                leads?.map((lead: any) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.email}</TableCell>
                    <TableCell>{lead.bedrijf || '-'}</TableCell>
                    <TableCell>{lead.website || '-'}</TableCell>
                    <TableCell>{lead.linkedin || '-'}</TableCell>
                    <TableCell>
                      {lead.image_path ? (
                        <img 
                          src={lead.image_path} 
                          alt="Avatar" 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs text-gray-500">-</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Bewerken
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
