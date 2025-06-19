
import React, { useState } from "react";
import { Bell, UserRound, Trash2, Plus, Edit, Server, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sendersApi } from "@/services/api";
import { toast } from "@/components/ui/sonner";
import { apiRequest } from "@/api/api";

interface Sender {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface EmailServer {
  id: string;
  email_address: string;
  password: string;
  pop_imap_server: string;
  smtp_server: string;
  smtp_port: number;
  use_ssl: boolean;
  use_tls: boolean;
  is_default: boolean;
}

export function SettingsContent() {
  const [isAddSenderOpen, setIsAddSenderOpen] = useState(false);
  const [isAddServerOpen, setIsAddServerOpen] = useState(false);
  const [editingSender, setEditingSender] = useState<Sender | null>(null);
  const [editingServer, setEditingServer] = useState<EmailServer | null>(null);
  const [newSender, setNewSender] = useState({ name: "", email: "", avatarUrl: "" });
  const [newServer, setNewServer] = useState({
    email_address: "",
    password: "",
    pop_imap_server: "",
    smtp_server: "",
    smtp_port: 587,
    use_ssl: true,
    use_tls: true,
    is_default: false
  });

  const queryClient = useQueryClient();

  // Fetch senders
  const { data: senders, isLoading: sendersLoading } = useQuery({
    queryKey: ['senders'],
    queryFn: sendersApi.getAll,
  });

  // Fetch email servers
  const { data: emailServers, isLoading: serversLoading } = useQuery({
    queryKey: ['email-servers'],
    queryFn: async () => {
      return apiRequest('/email-servers', { method: 'GET' });
    },
  });

  // Add sender mutation
  const addSenderMutation = useMutation({
    mutationFn: async (senderData: { name: string; email: string; avatarUrl?: string }) => {
      return apiRequest('/senders', {
        method: 'POST',
        body: JSON.stringify(senderData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['senders'] });
      setIsAddSenderOpen(false);
      setNewSender({ name: "", email: "", avatarUrl: "" });
      toast.success('Sender added successfully');
      window.dispatchEvent(new CustomEvent('senderUpdated'));
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add sender');
    },
  });

  // Add email server mutation
  const addServerMutation = useMutation({
    mutationFn: async (serverData: any) => {
      return apiRequest('/email-servers', {
        method: 'POST',
        body: JSON.stringify(serverData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-servers'] });
      setIsAddServerOpen(false);
      setNewServer({
        email_address: "",
        password: "",
        pop_imap_server: "",
        smtp_server: "",
        smtp_port: 587,
        use_ssl: true,
        use_tls: true,
        is_default: false
      });
      toast.success('Email server added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add email server');
    },
  });

  // Update sender mutation
  const updateSenderMutation = useMutation({
    mutationFn: async ({ id, ...senderData }: Sender) => {
      return apiRequest(`/senders/${id}`, {
        method: 'PUT',
        body: JSON.stringify(senderData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['senders'] });
      setEditingSender(null);
      toast.success('Sender updated successfully');
      window.dispatchEvent(new CustomEvent('senderUpdated'));
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update sender');
    },
  });

  // Update email server mutation
  const updateServerMutation = useMutation({
    mutationFn: async ({ id, ...serverData }: EmailServer) => {
      return apiRequest(`/email-servers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(serverData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-servers'] });
      setEditingServer(null);
      toast.success('Email server updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update email server');
    },
  });

  // Delete sender mutation
  const deleteSenderMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/senders/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['senders'] });
      toast.success('Sender deleted successfully');
      window.dispatchEvent(new CustomEvent('senderUpdated'));
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete sender');
    },
  });

  // Delete email server mutation
  const deleteServerMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/email-servers/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-servers'] });
      toast.success('Email server deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete email server');
    },
  });

  const handleAddSender = () => {
    if (!newSender.name || !newSender.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    addSenderMutation.mutate(newSender);
  };

  const handleAddServer = () => {
    if (!newServer.email_address || !newServer.password || !newServer.pop_imap_server || !newServer.smtp_server) {
      toast.error('Please fill in all required fields');
      return;
    }
    addServerMutation.mutate(newServer);
  };

  const handleUpdateSender = () => {
    if (!editingSender || !editingSender.name || !editingSender.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    updateSenderMutation.mutate(editingSender);
  };

  const handleUpdateServer = () => {
    if (!editingServer) return;
    updateServerMutation.mutate(editingServer);
  };

  const handleDeleteSender = (id: string) => {
    if (window.confirm('Are you sure you want to delete this sender?')) {
      deleteSenderMutation.mutate(id);
    }
  };

  const handleDeleteServer = (id: string) => {
    if (window.confirm('Are you sure you want to delete this email server?')) {
      deleteServerMutation.mutate(id);
    }
  };

  if (sendersLoading || serversLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <nav className="text-sm text-gray-500 mb-2">Settings</nav>
          <h1 className="text-2xl font-bold text-gray-900">Email Configuration</h1>
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

      <div className="space-y-8">
        {/* Email Servers Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Email Servers
              </CardTitle>
              <Dialog open={isAddServerOpen} onOpenChange={setIsAddServerOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Server
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Email Server</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="server-email">Email Address</Label>
                      <Input
                        id="server-email"
                        type="email"
                        value={newServer.email_address}
                        onChange={(e) => setNewServer({ ...newServer, email_address: e.target.value })}
                        placeholder="info@drijfveermedia.eu"
                      />
                    </div>
                    <div>
                      <Label htmlFor="server-password">Password</Label>
                      <Input
                        id="server-password"
                        type="password"
                        value={newServer.password}
                        onChange={(e) => setNewServer({ ...newServer, password: e.target.value })}
                        placeholder="Password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="server-pop">POP/IMAP Server</Label>
                      <Input
                        id="server-pop"
                        value={newServer.pop_imap_server}
                        onChange={(e) => setNewServer({ ...newServer, pop_imap_server: e.target.value })}
                        placeholder="mail.drijfveermedia.eu"
                      />
                    </div>
                    <div>
                      <Label htmlFor="server-smtp">SMTP Server</Label>
                      <Input
                        id="server-smtp"
                        value={newServer.smtp_server}
                        onChange={(e) => setNewServer({ ...newServer, smtp_server: e.target.value })}
                        placeholder="mail.drijfveermedia.eu"
                      />
                    </div>
                    <div>
                      <Label htmlFor="server-port">SMTP Port</Label>
                      <Input
                        id="server-port"
                        type="number"
                        value={newServer.smtp_port}
                        onChange={(e) => setNewServer({ ...newServer, smtp_port: parseInt(e.target.value) || 587 })}
                        placeholder="587"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="server-ssl">Use SSL</Label>
                      <Switch
                        id="server-ssl"
                        checked={newServer.use_ssl}
                        onCheckedChange={(checked) => setNewServer({ ...newServer, use_ssl: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="server-tls">Use TLS</Label>
                      <Switch
                        id="server-tls"
                        checked={newServer.use_tls}
                        onCheckedChange={(checked) => setNewServer({ ...newServer, use_tls: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="server-default">Set as Default</Label>
                      <Switch
                        id="server-default"
                        checked={newServer.is_default}
                        onCheckedChange={(checked) => setNewServer({ ...newServer, is_default: checked })}
                      />
                    </div>
                    <Button 
                      onClick={handleAddServer} 
                      disabled={addServerMutation.isPending}
                      className="w-full"
                    >
                      {addServerMutation.isPending ? 'Adding...' : 'Add Server'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emailServers?.map((server: EmailServer) => (
                <div key={server.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{server.email_address}</div>
                      <div className="text-sm text-gray-500">
                        {server.smtp_server}:{server.smtp_port}
                        {server.is_default && <span className="ml-2 text-blue-600 font-medium">Default</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingServer(server)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Email Server</DialogTitle>
                        </DialogHeader>
                        {editingServer && (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="edit-server-email">Email Address</Label>
                              <Input
                                id="edit-server-email"
                                type="email"
                                value={editingServer.email_address}
                                onChange={(e) => setEditingServer({ ...editingServer, email_address: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-server-password">Password</Label>
                              <Input
                                id="edit-server-password"
                                type="password"
                                value={editingServer.password}
                                onChange={(e) => setEditingServer({ ...editingServer, password: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-server-pop">POP/IMAP Server</Label>
                              <Input
                                id="edit-server-pop"
                                value={editingServer.pop_imap_server}
                                onChange={(e) => setEditingServer({ ...editingServer, pop_imap_server: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-server-smtp">SMTP Server</Label>
                              <Input
                                id="edit-server-smtp"
                                value={editingServer.smtp_server}
                                onChange={(e) => setEditingServer({ ...editingServer, smtp_server: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-server-port">SMTP Port</Label>
                              <Input
                                id="edit-server-port"
                                type="number"
                                value={editingServer.smtp_port}
                                onChange={(e) => setEditingServer({ ...editingServer, smtp_port: parseInt(e.target.value) || 587 })}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="edit-server-ssl">Use SSL</Label>
                              <Switch
                                id="edit-server-ssl"
                                checked={editingServer.use_ssl}
                                onCheckedChange={(checked) => setEditingServer({ ...editingServer, use_ssl: checked })}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="edit-server-tls">Use TLS</Label>
                              <Switch
                                id="edit-server-tls"
                                checked={editingServer.use_tls}
                                onCheckedChange={(checked) => setEditingServer({ ...editingServer, use_tls: checked })}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="edit-server-default">Set as Default</Label>
                              <Switch
                                id="edit-server-default"
                                checked={editingServer.is_default}
                                onCheckedChange={(checked) => setEditingServer({ ...editingServer, is_default: checked })}
                              />
                            </div>
                            <Button 
                              onClick={handleUpdateServer} 
                              disabled={updateServerMutation.isPending}
                              className="w-full"
                            >
                              {updateServerMutation.isPending ? 'Updating...' : 'Update Server'}
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteServer(server.id)}
                      disabled={deleteServerMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No email servers configured yet.</p>
                  <p className="text-sm">Add your first email server to get started.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Senders Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <UserRound className="h-5 w-5" />
                Email Senders
              </CardTitle>
              <Dialog open={isAddSenderOpen} onOpenChange={setIsAddSenderOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Sender
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Sender</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="sender-name">Name</Label>
                      <Input
                        id="sender-name"
                        value={newSender.name}
                        onChange={(e) => setNewSender({ ...newSender, name: e.target.value })}
                        placeholder="Sender name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sender-email">Email</Label>
                      <Input
                        id="sender-email"
                        type="email"
                        value={newSender.email}
                        onChange={(e) => setNewSender({ ...newSender, email: e.target.value })}
                        placeholder="sender@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sender-avatar">Avatar URL (optional)</Label>
                      <Input
                        id="sender-avatar"
                        value={newSender.avatarUrl}
                        onChange={(e) => setNewSender({ ...newSender, avatarUrl: e.target.value })}
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                    <Button 
                      onClick={handleAddSender} 
                      disabled={addSenderMutation.isPending}
                      className="w-full"
                    >
                      {addSenderMutation.isPending ? 'Adding...' : 'Add Sender'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {senders?.map((sender: Sender) => (
                <div key={sender.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={sender.avatarUrl} />
                      <AvatarFallback>
                        {sender.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{sender.name}</div>
                      <div className="text-sm text-gray-500">{sender.email}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingSender({
                            id: sender.id,
                            name: sender.name ?? "",
                            email: sender.email ?? "",
                            avatarUrl: sender.avatarUrl ?? ""
                          })}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Sender</DialogTitle>
                        </DialogHeader>
                        {editingSender && (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="edit-sender-name">Name</Label>
                              <Input
                                id="edit-sender-name"
                                value={editingSender.name}
                                onChange={(e) => setEditingSender({ ...editingSender, name: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-sender-email">Email</Label>
                              <Input
                                id="edit-sender-email"
                                type="email"
                                value={editingSender.email}
                                onChange={(e) => setEditingSender({ ...editingSender, email: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-sender-avatar">Avatar URL</Label>
                              <Input
                                id="edit-sender-avatar"
                                value={editingSender.avatarUrl ?? ''}
                                onChange={(e) => setEditingSender({ ...editingSender, avatarUrl: e.target.value })}
                              />
                            </div>
                            <Button 
                              onClick={handleUpdateSender} 
                              disabled={updateSenderMutation.isPending}
                              className="w-full"
                            >
                              {updateSenderMutation.isPending ? 'Updating...' : 'Update Sender'}
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSender(sender.id)}
                      disabled={deleteSenderMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  <UserRound className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No senders configured yet.</p>
                  <p className="text-sm">Add your first sender to get started.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
