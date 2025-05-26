
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NewCampaignContextType {
  templateId: string | null;
  setTemplateId: (id: string | null) => void;
  listId: string | null;
  setListId: (id: string | null) => void;
  scheduleAt: string | null;
  setScheduleAt: (date: string | null) => void;
  reset: () => void;
}

const NewCampaignContext = createContext<NewCampaignContextType | undefined>(undefined);

export const useNewCampaign = () => {
  const context = useContext(NewCampaignContext);
  if (!context) {
    throw new Error('useNewCampaign must be used within a NewCampaignProvider');
  }
  return context;
};

export const NewCampaignProvider = ({ children }: { children: ReactNode }) => {
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [listId, setListId] = useState<string | null>(null);
  const [scheduleAt, setScheduleAt] = useState<string | null>(null);

  const reset = () => {
    setTemplateId(null);
    setListId(null);
    setScheduleAt(null);
  };

  return (
    <NewCampaignContext.Provider value={{
      templateId,
      setTemplateId,
      listId,
      setListId,
      scheduleAt,
      setScheduleAt,
      reset,
    }}>
      {children}
    </NewCampaignContext.Provider>
  );
};
