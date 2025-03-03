import { create } from 'zustand';

interface DialogState {
  // Edit dialog state
  editDialogOpen: boolean;
  editingSubtitle: { id: number; text: string } | null;
  newSubtitleText: string;
  
  // Delete dialog state
  deleteDialogOpen: boolean;
  subtitleToDelete: number | null;
  
  // Actions
  openEditDialog: (subtitle: { id: number; text: string }) => void;
  closeEditDialog: () => void;
  setNewSubtitleText: (text: string) => void;
  openDeleteDialog: (id: number) => void;
  closeDeleteDialog: () => void;
}

export const useDialogStore = create<DialogState>()((set) => ({
  // Initial state
  editDialogOpen: false,
  editingSubtitle: null,
  newSubtitleText: '',
  deleteDialogOpen: false,
  subtitleToDelete: null,
  
  // Actions
  openEditDialog: (subtitle) => set({
    editDialogOpen: true,
    editingSubtitle: subtitle,
    newSubtitleText: subtitle.text
  }),
  
  closeEditDialog: () => set({
    editDialogOpen: false,
    editingSubtitle: null,
    newSubtitleText: ''
  }),
  
  setNewSubtitleText: (text) => set({
    newSubtitleText: text
  }),
  
  openDeleteDialog: (id) => set({
    deleteDialogOpen: true,
    subtitleToDelete: id
  }),
  
  closeDeleteDialog: () => set({
    deleteDialogOpen: false,
    subtitleToDelete: null
  })
}));