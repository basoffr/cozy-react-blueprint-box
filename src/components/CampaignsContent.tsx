
import { Bell, Plus, Calendar, Users, Send } from "lucide-react";
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
import { campaignsApi } from "@/services/api";

export function CampaignsContent() {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: campaignsApi.getAll,
  });

  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <nav className="text-sm text-gray-500 mb-2">Campaigns</nav>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link to="/campaigns/new">
              <Plus className="h-4 w-4 mr-2" />
              Nieuwe campagne
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

      {/* Campaigns Table */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer">Campagne naam</TableHead>
                <TableHead className="cursor-pointer">Template</TableHead>
                <TableHead className="cursor-pointer">Status</TableHead>
                <TableHead className="cursor-pointer">Leads</TableHead>
                <TableHead className="cursor-pointer">Verzonden</TableHead>
                <TableHead className="cursor-pointer">Opens</TableHead>
                <TableHead className="cursor-pointer">Replies</TableHead>
                <TableHead className="cursor-pointer">Aangemaakt</TableHead>
                <TableHead>Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    Loading campaigns...
                  </TableCell>
                </TableRow>
              ) : campaigns?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    Geen campagnes gevonden
                  </TableCell>
                </TableRow>
              ) : (
                campaigns?.map((campaign: any) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>{campaign.template_name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </TableCell>
                    <TableCell>{campaign.total_leads}</TableCell>
                    <TableCell>{campaign.emails_sent}</TableCell>
                    <TableCell>{campaign.opens}</TableCell>
                    <TableCell>{campaign.replies}</TableCell>
                    <TableCell>{new Date(campaign.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Details
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
