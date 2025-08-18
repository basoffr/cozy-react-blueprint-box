
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { leadsApi } from "@/services/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

interface Lead {
  id: string;
  email: string;
  bedrijf: string | null;
  website: string | null;
  linkedin: string | null;
  image_path: string | null;
}

interface LeadEditDialogProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadUpdated: () => void;
}

export function LeadEditDialog({ lead, open, onOpenChange, onLeadUpdated }: LeadEditDialogProps) {
  const [formData, setFormData] = useState({
    email: lead?.email || "",
    bedrijf: lead?.bedrijf || "",
    website: lead?.website || "",
    linkedin: lead?.linkedin || "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentImageUrl = () => {
    if (avatarPreview) return avatarPreview;
    if (lead?.image_path) {
      const { data } = supabase.storage.from('lead-images').getPublicUrl(lead.image_path);
      return data.publicUrl;
    }
    return null;
  };

  const handleSave = async () => {
    if (!lead) return;

    setIsLoading(true);
    try {
      let imagePath = lead.image_path;

      // Upload avatar if a new file was selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `avatars/${lead.id}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('lead-images')
          .upload(fileName, avatarFile, { upsert: true });

        if (uploadError) {
          throw uploadError;
        }

        imagePath = fileName;
      }

      // Update lead in database using our API
      await leadsApi.update(lead.id, {
        email: formData.email,
        bedrijf: formData.bedrijf || null,
        website: formData.website || null,
        linkedin: formData.linkedin || null,
        image_path: imagePath,
      });

      toast({
        title: "Lead saved",
        description: "Lead has been updated successfully.",
      });

      onLeadUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving lead:', error);
      toast({
        title: "Error",
        description: "Failed to save lead. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when dialog opens/closes or lead changes
  React.useEffect(() => {
    if (lead) {
      setFormData({
        email: lead.email || "",
        bedrijf: lead.bedrijf || "",
        website: lead.website || "",
        linkedin: lead.linkedin || "",
      });
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  }, [lead, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Lead</DialogTitle>
          <DialogDescription>
            Update the lead information and upload an avatar image.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={getCurrentImageUrl() || undefined} />
              <AvatarFallback className="bg-gray-100">
                <Upload className="h-8 w-8 text-gray-400" />
              </AvatarFallback>
            </Avatar>
            
            <div className="w-full">
              <Label htmlFor="avatar-upload" className="block text-sm font-medium mb-2">
                Profile Image
              </Label>
              <Input
                id="avatar-upload"
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleAvatarChange}
                className="w-full"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium mb-1">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="bedrijf" className="block text-sm font-medium mb-1">
                Company
              </Label>
              <Input
                id="bedrijf"
                value={formData.bedrijf}
                onChange={(e) => handleInputChange('bedrijf', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="website" className="block text-sm font-medium mb-1">
                Website
              </Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="linkedin" className="block text-sm font-medium mb-1">
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                value={formData.linkedin}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
