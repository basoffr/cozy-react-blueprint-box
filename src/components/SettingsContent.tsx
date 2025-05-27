
import React, { useState, useEffect } from "react";
import { Bell, UserRound, Trash2, Plus, Edit, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sendersApi } from "@/services/api";

interface Sender {
  id: string;
  name: string;
  email: string;
  daily_quota: number;
  signature?: string;
  avatarUrl?: string;
}

interface SenderFormData {
  name: string;
  email: string;
  daily_quota: number;
  signature: string;
}

export function SettingsContent() {
  const [activeTab, setActiveTab] = useState("senders");
  const [isSenderModalOpen, setIsSenderModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingSender, setEditingSender] = useState<Sender | null>(null);
  const [deletingSender, setDeleteingSender] = useState<Sender | null>(null);
  const [formData, setFormData] = useState<SenderFormData>({
    name: "",
    email: "",
    daily_quota: 100,
    signature: ""
  });
  const [formErrors, setFormErrors] = useState<Partial<SenderFormData>>({});

  const queryClient = useQueryClient();

  // Fetch senders
  const { data: senders, isLoading: sendersLoading } = useQuery({
    queryKey: ['senders'],
    queryFn: sendersApi.getAll,
  });

  // Create sender mutation
  const createSenderMutation = useMutation({
    mutationFn: (data: SenderFormData) => 
      fetch(`${import.meta.env.VITE_API_URL || 'https://api.mydomain.com'}/api/senders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(data),
      }).then(res => {
        if (!res.ok) throw new Error('Failed to create sender');
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['senders'] });
      setIsSenderModalOpen(false);
      resetForm();
      toast.success('Sender created successfully');
      // Emit custom event for sequence editor
      window.dispatchEvent(new CustomEvent('senderUpdated'));
    },
    onError: () => {
      toast.error('Failed to create sender');
    },
  });

  // Update sender mutation
  const updateSenderMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SenderFormData }) =>
      fetch(`${import.meta.env.VITE_API_URL || 'https://api.mydomain.com'}/api/senders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(data),
      }).then(res => {
        if (!res.ok) throw new Error('Failed to update sender');
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['senders'] });
      setIsSenderModalOpen(false);
      resetForm();
      toast.success('Sender updated successfully');
      window.dispatchEvent(new CustomEvent('senderUpdated'));
    },
    onError: () => {
      toast.error('Failed to update sender');
    },
  });

  // Delete sender mutation
  const deleteSenderMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`${import.meta.env.VITE_API_URL || 'https://api.mydomain.com'}/api/senders/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      }).then(res => {
        if (!res.ok) throw new Error('Failed to delete sender');
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['senders'] });
      setIsDeleteDialogOpen(false);
      setDeletingSender(null);
      toast.success('Sender deleted successfully');
      window.dispatchEvent(new CustomEvent('senderUpdated'));
    },
    onError: () => {
      toast.error('Failed to delete sender');
    },
  });

  const resetForm = () => {
    setFormData({ name: "", email: "", daily_quota: 100, signature: "" });
    setFormErrors({});
    setEditingSender(null);
  };

  const validateForm = (): boolean => {
    const errors: Partial<SenderFormData> = {};
    
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid email format";
    if (formData.daily_quota < 1 || formData.daily_quota > 500) {
      errors.daily_quota = "Daily quota must be between 1 and 500";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenSenderModal = (sender?: Sender) => {
    if (sender) {
      setEditingSender(sender);
      setFormData({
        name: sender.name,
        email: sender.email,
        daily_quota: sender.daily_quota,
        signature: sender.signature || ""
      });
    } else {
      resetForm();
    }
    setIsSenderModalOpen(true);
  };

  const handleSaveSender = () => {
    if (!validateForm()) return;

    if (editingSender) {
      updateSenderMutation.mutate({ id: editingSender.id, data: formData });
    } else {
      createSenderMutation.mutate(formData);
    }
  };

  const handleDeleteSender = (sender: Sender) => {
    setDeletingSender(sender);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingSender) {
      deleteSenderMutation.mutate(deletingSender.id);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <nav className="text-sm text-gray-500 mb-2">Instellingen</nav>
          <h1 className="text-2xl font-bold text-gray-900">Instellingen</h1>
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

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-96">
          <TabsTrigger value="senders">Email Senders</TabsTrigger>
          <TabsTrigger value="smtp">SMTP & API Keys</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        {/* Email Senders Tab */}
        <TabsContent value="senders">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <UserRound className="h-5 w-5" />
                Email Senders
              </CardTitle>
              <Button onClick={() => handleOpenSenderModal()} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Sender
              </Button>
            </CardHeader>
            <CardContent>
              {sendersLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sender</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Daily Quota</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {senders?.map((sender: Sender) => (
                      <TableRow key={sender.id}>
                        <TableCell className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={sender.avatarUrl} />
                            <AvatarFallback>
                              {sender.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{sender.name}</span>
                        </TableCell>
                        <TableCell>{sender.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{sender.daily_quota}/day</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenSenderModal(sender)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSender(sender)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMTP & API Keys Tab */}
        <TabsContent value="smtp">
          <Card>
            <CardHeader>
              <CardTitle>SMTP & API Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="smtp-server" className="text-sm font-medium text-gray-700">
                  SMTP-server
                </Label>
                <Input
                  id="smtp-server"
                  defaultValue="smtp.example.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="smtp-port" className="text-sm font-medium text-gray-700">
                  SMTP-poort
                </Label>
                <Input
                  id="smtp-port"
                  defaultValue="587"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email-sender" className="text-sm font-medium text-gray-700">
                  E-mailadres (afzender)
                </Label>
                <Input
                  id="email-sender"
                  defaultValue="jij@example.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="send-delay" className="text-sm font-medium text-gray-700">
                  Verzendvertraging (seconden)
                </Label>
                <Input
                  id="send-delay"
                  defaultValue="300"
                  className="mt-1"
                />
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
                Save SMTP Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* General Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="batch-size" className="text-sm font-medium text-gray-700">
                  Standaard batchgrootte
                </Label>
                <Input
                  id="batch-size"
                  defaultValue="10"
                  className="mt-1"
                />
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sender Modal */}
      <Dialog open={isSenderModalOpen} onOpenChange={setIsSenderModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSender ? 'Edit Sender' : 'Add New Sender'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sender-name">Display Name</Label>
              <Input
                id="sender-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={formErrors.name ? "border-red-500" : ""}
              />
              {formErrors.name && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sender-email">Email Address</Label>
              <Input
                id="sender-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={formErrors.email ? "border-red-500" : ""}
              />
              {formErrors.email && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sender-quota">Daily Quota (max 500)</Label>
              <Input
                id="sender-quota"
                type="number"
                min="1"
                max="500"
                value={formData.daily_quota}
                onChange={(e) => setFormData(prev => ({ ...prev, daily_quota: parseInt(e.target.value) || 0 }))}
                className={formErrors.daily_quota ? "border-red-500" : ""}
              />
              {formErrors.daily_quota && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors.daily_quota}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sender-signature">Signature (optional)</Label>
              <Textarea
                id="sender-signature"
                value={formData.signature}
                onChange={(e) => setFormData(prev => ({ ...prev, signature: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSenderModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveSender}
              disabled={createSenderMutation.isPending || updateSenderMutation.isPending}
            >
              {editingSender ? 'Update' : 'Create'} Sender
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Sender</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <strong>{deletingSender?.name}</strong>? 
              This action cannot be undone.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteSenderMutation.isPending}
            >
              Delete Sender
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
