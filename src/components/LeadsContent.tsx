
import { Bell, Search, Filter, Users, Plus } from "lucide-react";
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

const leadsData = [
  {
    email: "info@dehoogbouwdien...",
    name: "",
    company: "",
    website: "Website",
    linkedin: "—",
    dateAdded: "12-05-2025",
    status: "Bewerken"
  },
  {
    email: "info@bouwbedrijfspeel...",
    name: "",
    company: "",
    website: "Website",
    linkedin: "—",
    dateAdded: "12-05-2025",
    status: "Bewerken"
  },
  {
    email: "info@ibrbv.nl",
    name: "",
    company: "",
    website: "Website",
    linkedin: "—",
    dateAdded: "12-05-2025",
    status: "Bewerken"
  },
  {
    email: "info@bouwbedrijflucas...",
    name: "",
    company: "",
    website: "Website",
    linkedin: "—",
    dateAdded: "12-05-2025",
    status: "Bewerken"
  },
  {
    email: "info@jkbouw.nl",
    name: "",
    company: "",
    website: "Website",
    linkedin: "—",
    dateAdded: "12-05-2025",
    status: "Bewerken"
  },
  {
    email: "info@poppink.nl",
    name: "",
    company: "",
    website: "Website",
    linkedin: "—",
    dateAdded: "12-05-2025",
    status: "Bewerken"
  },
  {
    email: "info@nipeco.nl",
    name: "",
    company: "",
    website: "Website",
    linkedin: "—",
    dateAdded: "12-05-2025",
    status: "Bewerken"
  },
  {
    email: "info@schulerafbouwgr...",
    name: "",
    company: "",
    website: "Website",
    linkedin: "—",
    dateAdded: "12-05-2025",
    status: "Bewerken"
  }
];

export function LeadsContent() {
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
          <span className="font-semibold">Leads 223</span>
        </div>
        <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option>Alle lijsten (223)</option>
        </select>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Zoek e-mail, naam..."
            className="pl-10"
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
            {leadsData.map((lead, index) => (
              <TableRow key={index}>
                <TableCell>
                  <input type="checkbox" className="rounded" />
                </TableCell>
                <TableCell className="text-blue-600">{lead.email}</TableCell>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.company}</TableCell>
                <TableCell>
                  <span className="text-blue-600">{lead.website}</span>
                </TableCell>
                <TableCell>{lead.linkedin}</TableCell>
                <TableCell>{lead.dateAdded}</TableCell>
                <TableCell>
                  <div className="w-8 h-6 bg-gray-800 rounded"></div>
                </TableCell>
                <TableCell>—</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    {lead.status}
                  </Button>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
