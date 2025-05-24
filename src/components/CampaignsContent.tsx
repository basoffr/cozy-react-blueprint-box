
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const campaignsData = [
  {
    id: 1,
    name: "Test Campagne",
    createdAt: "2025-05-19 12:18:05",
    status: "DRAFT",
    sent: 0,
  },
];

export const CampaignsContent = () => {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Campaigns</h1>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nieuwe campagne aanmaken
        </Button>
      </div>

      {/* Campaigns Overview */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium text-gray-900">Overzicht campagnes</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Naam</TableHead>
                <TableHead>Aangemaakt op</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verzonden</TableHead>
                <TableHead>Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaignsData.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>{campaign.createdAt}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                      {campaign.status}
                    </span>
                  </TableCell>
                  <TableCell>{campaign.sent}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
