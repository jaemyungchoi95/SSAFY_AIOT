import { create } from 'zustand';

export const useIssueStore = create((set) => ({
  selectedIssue: null,
  selectedReport: null,

  setSelectedIssue: (issue) => set({ selectedIssue: issue }),
  setSelectedReport: (report) => set({ selectedReport: report }),

  clearModal: () => set({ selectedIssue: null, selectedReport: null }),
}));
