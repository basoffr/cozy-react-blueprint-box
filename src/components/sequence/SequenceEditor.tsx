
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Mail, Clock, Phone, GitBranch, Save, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/sonner';

// Types for our data
interface Sender {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
}

interface SequenceStep {
  id: string;
  type: 'email' | 'wait' | 'call' | 'branch';
  title: string;
  senders?: Sender[];
  templates?: Template[];
  waitDays?: number;
  waitHours?: number;
  abTestType?: 'equal' | 'round-robin';
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.mydomain.com';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const SequenceEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Fetch template and senders data
  const { data: template, isLoading: templateLoading } = useQuery({
    queryKey: ['template', id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/templates/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    },
    enabled: !!id,
  });

  const { data: senders, isLoading: sendersLoading } = useQuery({
    queryKey: ['senders'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/senders`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    },
  });

  const availableTemplates = template ? [template] : [];
  const availableSenders = senders || [];
  
  // State
  const [steps, setSteps] = useState<SequenceStep[]>([
    { id: 'start', type: 'email', title: 'Sequence Start' },
  ]);
  
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<SequenceStep | null>(null);
  const [selectedSenders, setSelectedSenders] = useState<Sender[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<Template[]>([]);
  const [abTestType, setAbTestType] = useState<'equal' | 'round-robin'>('equal');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize with template when loaded
  useEffect(() => {
    if (template && steps.length === 1) {
      setSteps([
        { 
          id: 'start', 
          type: 'email', 
          title: 'Sequence Start',
          templates: [template]
        },
      ]);
    }
  }, [template]);
  
  // Handle opening the email step modal
  const openEmailModal = (step?: SequenceStep) => {
    if (step) {
      setCurrentStep(step);
      setSelectedSenders(step.senders || []);
      setSelectedTemplates(step.templates || []);
      setAbTestType(step.abTestType || 'equal');
    } else {
      setCurrentStep(null);
      setSelectedSenders([]);
      setSelectedTemplates([]);
      setAbTestType('equal');
    }
    setIsEmailModalOpen(true);
  };
  
  // Handle saving the email step
  const handleSaveEmailStep = () => {
    if (currentStep) {
      // Update existing step
      setSteps(steps.map(step => 
        step.id === currentStep.id 
          ? { ...step, senders: selectedSenders, templates: selectedTemplates, abTestType } 
          : step
      ));
    } else {
      // Create new step
      const newStep: SequenceStep = {
        id: `${Date.now()}`,
        type: 'email',
        title: selectedTemplates.length > 0 ? selectedTemplates[0].subject : 'New Email',
        senders: selectedSenders,
        templates: selectedTemplates,
        abTestType
      };
      setSteps([...steps, newStep]);
    }
    setIsEmailModalOpen(false);
  };
  
  // Handle adding a wait step
  const handleAddWaitStep = () => {
    const newStep: SequenceStep = {
      id: `${Date.now()}`,
      type: 'wait',
      title: 'Wait',
      waitDays: 3,
      waitHours: 0
    };
    setSteps([...steps, newStep]);
  };

  // Handle saving sequence
  const handleSaveSequence = async () => {
    if (!id) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/templates/${id}/sequence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ steps }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      toast.success('Sequence saved');
      navigate('/templates');
    } catch (error: any) {
      console.error('Save sequence error:', error);
      toast.error(error.message || 'Failed to save sequence');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle sender selection
  const toggleSender = (sender: Sender) => {
    if (selectedSenders.some(s => s.id === sender.id)) {
      setSelectedSenders(selectedSenders.filter(s => s.id !== sender.id));
    } else {
      setSelectedSenders([...selectedSenders, sender]);
    }
  };

  // Toggle template selection
  const toggleTemplate = (template: Template) => {
    if (selectedTemplates.some(t => t.id === template.id)) {
      setSelectedTemplates(selectedTemplates.filter(t => t.id !== template.id));
    } else {
      setSelectedTemplates([...selectedTemplates, template]);
    }
  };

  if (templateLoading || sendersLoading) {
    return (
      <div className="min-h-screen flex w-full bg-gray-50">
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
          </div>
          <div className="space-y-4 max-w-3xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex w-full bg-gray-50 overflow-auto">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#5C4DAF]">Sequence Editor</h1>
          <Button onClick={handleSaveSequence} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Sequence'}
          </Button>
        </div>
        
        {/* Toolbar */}
        <div className="flex gap-2 mb-4">
          <Button 
            variant="outline" 
            className="border-[#5C4DAF] text-[#5C4DAF] hover:bg-[#5C4DAF]/10" 
            onClick={() => openEmailModal()}
          >
            <Mail className="mr-2 h-4 w-4" /> + Email
          </Button>
          <Button 
            variant="outline" 
            className="border-[#5C4DAF] text-[#5C4DAF] hover:bg-[#5C4DAF]/10"
            onClick={handleAddWaitStep}
          >
            <Clock className="mr-2 h-4 w-4" /> + Wait
          </Button>
          <Button 
            variant="outline" 
            className="border-[#5C4DAF] text-[#5C4DAF] hover:bg-[#5C4DAF]/10"
          >
            <Phone className="mr-2 h-4 w-4" /> + Call
          </Button>
          <Button 
            variant="outline" 
            className="border-[#5C4DAF] text-[#5C4DAF] hover:bg-[#5C4DAF]/10"
          >
            <GitBranch className="mr-2 h-4 w-4" /> + Branch
          </Button>
        </div>
        
        {/* Sequence Canvas */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              {index > 0 && (
                <div className="absolute left-6 -top-4 h-4 w-0.5 bg-gray-300"></div>
              )}
              <Card className={`p-4 ${step.type === 'email' && index > 0 ? 'border-[#5C4DAF]/50' : ''}`}>
                {step.type === 'email' && index === 0 ? (
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{step.title}</div>
                  </div>
                ) : step.type === 'email' ? (
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Email: {step.title}</div>
                      <div className="flex gap-2 mt-2">
                        {step.senders && step.senders.length > 0 && (
                          <Badge className="bg-pink-500">
                            {step.senders.length} sender{step.senders.length > 1 ? 's' : ''}
                          </Badge>
                        )}
                        {step.templates && step.templates.length > 1 && (
                          <Badge className="bg-blue-500">
                            {step.templates.length} variants
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => openEmailModal(step)}>
                      Edit
                    </Button>
                  </div>
                ) : step.type === 'wait' ? (
                  <div className="flex items-center">
                    <Clock className="text-gray-500 mr-2" />
                    <span>Wait {step.waitDays} day{step.waitDays !== 1 ? 's' : ''}</span>
                  </div>
                ) : null}
              </Card>
            </div>
          ))}
        </div>
        
        {/* Email Step Modal */}
        <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-[#5C4DAF]">
                {currentStep ? 'Edit Email Step' : 'Add Email Step'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select sender(s)</label>
                <div className="border rounded-md p-4 space-y-2">
                  {availableSenders.map((sender: Sender) => (
                    <div key={sender.id} className="flex items-center space-x-2">
                      <Checkbox 
                        checked={selectedSenders.some(s => s.id === sender.id)} 
                        onCheckedChange={() => toggleSender(sender)}
                      />
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={sender.avatarUrl} />
                          <AvatarFallback>
                            {sender.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{sender.name}</div>
                          <div className="text-xs text-gray-500">{sender.email}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Select template(s)</label>
                <div className="border rounded-md p-4 space-y-3">
                  {availableTemplates.map((template, idx) => (
                    <div key={template.id} className="flex items-center space-x-2">
                      <Checkbox 
                        checked={selectedTemplates.some(t => t.id === template.id)} 
                        onCheckedChange={() => toggleTemplate(template)}
                      />
                      <div className="flex items-center gap-2">
                        <Badge variant={idx % 2 === 0 ? "default" : "secondary"} className="h-6 w-6 rounded-full flex items-center justify-center p-0">
                          {idx % 2 === 0 ? 'A' : 'B'}
                        </Badge>
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-xs text-gray-500">Subject: {template.subject}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedTemplates.length > 1 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">A/B Test Settings</label>
                  <Tabs defaultValue="equal" value={abTestType} onValueChange={(v) => setAbTestType(v as 'equal' | 'round-robin')}>
                    <TabsList className="w-full">
                      <TabsTrigger value="equal" className="flex-1">Equal distribution (50/50)</TabsTrigger>
                      <TabsTrigger value="round-robin" className="flex-1">Round robin</TabsTrigger>
                    </TabsList>
                    <TabsContent value="equal" className="p-4 text-sm text-gray-600">
                      Each variant will be sent to an equal number of recipients
                    </TabsContent>
                    <TabsContent value="round-robin" className="p-4 text-sm text-gray-600">
                      Variants will be sent in alternating order
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEmailModalOpen(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button 
                onClick={handleSaveEmailStep} 
                disabled={selectedSenders.length === 0 || selectedTemplates.length === 0}
                className="bg-[#5C4DAF] hover:bg-[#5C4DAF]/90"
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SequenceEditor;
