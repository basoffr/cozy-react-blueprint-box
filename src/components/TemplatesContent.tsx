
import React, { useState, useEffect } from "react";
import { Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { templatesApi } from "@/services/templatesApi";
import { PerformanceMonitor, ProfiledComponent } from "@/utils/performance";
import { OptimizedTemplateRow } from "./OptimizedTemplateRow";
import { TemplatePreviewModal } from "./TemplatePreviewModal";

const TEMPLATES_PER_PAGE = 20;

export function TemplatesContent() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  
  useEffect(() => {
    PerformanceMonitor.logPageLoad('Templates List');
  }, []);
  
  const { data: templatesResponse, isLoading, error } = useQuery({
    queryKey: ['templates-list', currentPage],
    queryFn: () => {
      PerformanceMonitor.startMeasurement('templates-fetch');
      return templatesApi.getList(currentPage, TEMPLATES_PER_PAGE).then(result => {
        PerformanceMonitor.endMeasurement('templates-fetch');
        return result;
      });
    },
  });

  const templates = Array.isArray(templatesResponse) ? templatesResponse : [];
  const totalPages = 1; // Since we don't have pagination info from the API

  const handleEditSequence = (templateId: string) => {
    navigate(`/templates/${templateId}/sequence`);
  };

  const handleCreateNewTemplate = () => {
    navigate('/templates/new/sequence');
  };

  const handlePreview = (templateId: string) => {
    setPreviewTemplateId(templateId);
  };

  const handleClosePreview = () => {
    setPreviewTemplateId(null);
  };

  if (isLoading) {
    return (
      <ProfiledComponent id="templates-skeleton">
        <div className="p-6">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <div>
              <nav className="text-sm text-gray-500 mb-2">Templates</nav>
              <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </header>

          {/* Templates List Skeleton */}
          <div className="space-y-4">
            {Array.from({ length: TEMPLATES_PER_PAGE }, (_, index) => (
              <Skeleton key={index} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </ProfiledComponent>
    );
  }

  return (
    <ProfiledComponent id="templates-content">
      <div className="p-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <nav className="text-sm text-gray-500 mb-2">Templates</nav>
            <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleCreateNewTemplate}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nieuwe sequence aanmaken
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

        {/* Templates List */}
        <div className="space-y-4">
          {templates.length > 0 ? (
            templates.map((template: any) => (
              <OptimizedTemplateRow
                key={template.id}
                template={template}
                onEditSequence={handleEditSequence}
                onPreview={handlePreview}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No templates found
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {/* Preview Modal */}
        <TemplatePreviewModal
          templateId={previewTemplateId}
          onClose={handleClosePreview}
        />
      </div>
    </ProfiledComponent>
  );
}
