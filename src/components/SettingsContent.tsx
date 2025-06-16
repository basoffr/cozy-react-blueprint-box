import React, { useState, useEffect } from "react";
import { Bell, UserRound, Trash2, Plus, Edit, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sendersApi, settingsApi } from "@/services/api";
import { toast } from "@/components/ui/sonner";
import { apiRequest } from "@/api/api";

interface Sender {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface Settings {
  emailSignature: string;
  defaultFromName: string;
  replyToEmail: string;
  trackOpens: boolean;
  trackClicks: boolean;
}

export function SettingsContent() {
  const [isAddSenderOpen, setIsAddSenderOpen] = useState(false);
  const [editingSender, setEditingSender] = useState<Sender | null>(null);
  const [newSender, setNewSender] = useState({ name: "", email: "", avatarUrl: "" });
  const [settings, setSettings] = useState<Settings>({
    emailSignature: "",
    defaultFromName: "",
    replyToEmail: "",
    trackOpens: true,
    trackClicks: true,
  });

  const queryClient = useQueryClient();

  // Fetch senders
  const { data: senders, isLoading: sendersLoading } = useQuery({
    queryKey: ['senders'],
    queryFn: sendersApi.getAll,
  });

  // Fetch settings
  const { data: settingsData, isLoading: settingsLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.get,
  });

  // Update settings when data is fetched
  useEffect(() => {
    if (settingsData) {
      // Ensure all form fields have non-undefined values
      setSettings({
        emailSignature: settingsData.emailSignature ?? "",
        defaultFromName: settingsData.defaultFromName ?? "",
        replyToEmail: settingsData.replyToEmail ?? "",
        trackOpens: settingsData.trackOpens ?? true,
        trackClicks: settingsData.trackClicks ?? true,
      });
    }
  }, [settingsData]);

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
      
      // Dispatch event for sequence editor
      window.dispatchEvent(new CustomEvent('senderUpdated'));
    },
    onError: (error: any) => {
      console.error('Add sender error:', error);
      toast.error(error.message || 'Failed to add sender');
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
      
      // Dispatch event for sequence editor
      window.dispatchEvent(new CustomEvent('senderUpdated'));
    },
    onError: (error: any) => {
      console.error('Update sender error:', error);
      toast.error(error.message || 'Failed to update sender');
    },
  });

  // Delete sender mutation
  const deleteSenderMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/senders/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['senders'] });
      toast.success('Sender deleted successfully');
      
      // Dispatch event for sequence editor
      window.dispatchEvent(new CustomEvent('senderUpdated'));
    },
    onError: (error: any) => {
      console.error('Delete sender error:', error);
      toast.error(error.message || 'Failed to delete sender');
    },
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: settingsApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Settings saved successfully');
    },
    onError: (error: any) => {
      console.error('Update settings error:', error);
      toast.error(error.message || 'Failed to save settings');
    },
  });

  const handleAddSender = () => {
    if (!newSender.name || !newSender.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    addSenderMutation.mutate(newSender);
  };

  const handleUpdateSender = () => {
    if (!editingSender || !editingSender.name || !editingSender.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    updateSenderMutation.mutate(editingSender);
  };

  const handleDeleteSender = (id: string) => {
    if (window.confirm('Are you sure you want to delete this sender?')) {
      deleteSenderMutation.mutate(id);
    }
  };

  const handleSettingsChange = (field: keyof Settings, value: string | boolean | number) => {
    const updatedSettings = { ...settings, [field]: typeof value === 'string' && field !== 'emailSignature' && field !== 'defaultFromName' && field !== 'replyToEmail' ? parseInt(value) || 0 : value };
    setSettings(updatedSettings);
    updateSettingsMutation.mutate(updatedSettings);
  };

  if (sendersLoading || settingsLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
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

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Email Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="default-from-name">Default From Name</Label>
              <Input
                id="default-from-name"
                value={settings.defaultFromName}
                onChange={(e) => handleSettingsChange('defaultFromName', e.target.value)}
                placeholder="Your Company Name"
              />
            </div>
            <div>
              <Label htmlFor="reply-to-email">Reply-To Email</Label>
              <Input
                id="reply-to-email"
                type="email"
                value={settings.replyToEmail}
                onChange={(e) => handleSettingsChange('replyToEmail', e.target.value)}
                placeholder="noreply@yourcompany.com"
              />
            </div>
            <div>
              <Label htmlFor="email-signature">Email Signature</Label>
              <textarea
                id="email-signature"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                value={settings.emailSignature}
                onChange={(e) => handleSettingsChange('emailSignature', e.target.value)}
                placeholder="Best regards,&#10;Your Name&#10;Your Company"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tracking Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Tracking Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Track Email Opens</div>
                <div className="text-sm text-gray-500">Monitor when recipients open your emails</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.trackOpens}
                  onChange={(e) => handleSettingsChange('trackOpens', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Track Link Clicks</div>
                <div className="text-sm text-gray-500">Monitor when recipients click links in your emails</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.trackClicks}
                  onChange={(e) => handleSettingsChange('trackClicks', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
