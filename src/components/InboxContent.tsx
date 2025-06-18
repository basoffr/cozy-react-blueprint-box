
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Search, Filter, MailOpen } from "lucide-react";
import { inboxApi } from "@/services/inboxApi";
import type { InboxEmail } from "@/types/inbox";
import { format } from "date-fns";

export function InboxContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState<string>("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const { data: emails = [], isLoading } = useQuery({
    queryKey: ['inbox-emails'],
    queryFn: inboxApi.getAll,
  });

  const { data: recipients = [] } = useQuery({
    queryKey: ['inbox-recipients'],
    queryFn: inboxApi.getRecipients,
  });

  const filteredEmails = emails.filter((email: InboxEmail) => {
    const matchesSearch = 
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.sender_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.sender_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.body_preview?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRecipient = selectedRecipient === "all" || email.recipient_email === selectedRecipient;
    const matchesReadStatus = !showUnreadOnly || !email.is_read;

    return matchesSearch && matchesRecipient && matchesReadStatus;
  });

  const markAsRead = async (emailId: string) => {
    await inboxApi.markAsRead(emailId);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Inbox</h1>
            <p className="text-gray-600 mt-1">
              {filteredEmails.length} email{filteredEmails.length !== 1 ? 's' : ''}
              {showUnreadOnly && ' (unread only)'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {emails.filter((e: InboxEmail) => !e.is_read).length} unread
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Filter by recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All recipients</SelectItem>
                  {recipients.map((recipient: string) => (
                    <SelectItem key={recipient} value={recipient}>
                      {recipient}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant={showUnreadOnly ? "default" : "outline"}
                onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Unread only
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Email List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading emails...</p>
            </div>
          ) : filteredEmails.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No emails found</h3>
                  <p className="text-gray-600">
                    {emails.length === 0 
                      ? "You haven't received any emails yet."
                      : "No emails match your current filters."
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredEmails.map((email: InboxEmail) => (
              <Card 
                key={email.id} 
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                  !email.is_read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                }`}
                onClick={() => markAsRead(email.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          {!email.is_read ? (
                            <Mail className="h-4 w-4 text-blue-600" />
                          ) : (
                            <MailOpen className="h-4 w-4 text-gray-400" />
                          )}
                          <span className={`font-medium ${!email.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {email.sender_name || email.sender_email}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          To: {email.recipient_email}
                        </Badge>
                      </div>
                      <h3 className={`text-sm mb-2 ${!email.is_read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                        {email.subject}
                      </h3>
                      {email.body_preview && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {email.body_preview}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-xs text-gray-500">
                        {format(new Date(email.received_at), 'MMM d, HH:mm')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
