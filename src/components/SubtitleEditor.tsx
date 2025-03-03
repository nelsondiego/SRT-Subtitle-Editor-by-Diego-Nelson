"use client";

import { FileText, Upload, Loader2, Pencil, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useVideoStore } from '@/lib/store';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { useDialogStore } from '@/lib/dialogStore';

export function SubtitleEditor() {
  const { 
    subtitles,
    currentTime,
    loading,
    handleSubtitleFileUpload,
    isPlaying,
    deleteSubtitle,
    updateSubtitle
  } = useVideoStore();

  const {
    editDialogOpen,
    editingSubtitle,
    newSubtitleText,
    deleteDialogOpen,
    subtitleToDelete,
    openEditDialog,
    closeEditDialog,
    setNewSubtitleText,
    openDeleteDialog,
    closeDeleteDialog
  } = useDialogStore();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentSubtitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentSubtitleRef.current && isPlaying) {
      currentSubtitleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (!isPlaying && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentTime, isPlaying]);

  const msToTime = (ms: number): string => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = (ms % 1000).toString().padStart(3, '0').slice(0, 3);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')},${milliseconds}`;
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center p-2 border-b">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <h2 className="text-base font-semibold">Subtitles</h2>
        </div>
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      </div>

      {subtitles.length === 0 && !loading && (
        <label className="flex flex-col items-center justify-center h-[100px] border-2 border-dashed rounded-lg m-2 cursor-pointer hover:bg-accent/50 transition-colors">
          <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
          <span className="text-sm font-medium">Importar archivo SRT o haga clic para cargar</span>
          <input
            type="file"
            accept=".srt"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleSubtitleFileUpload(file);
            }}
          />
        </label>
      )}

      {subtitles.length > 0 && (
        <ScrollArea className="h-[calc(100vh-16rem)] border-0">
          <div ref={scrollContainerRef} className="p-2 space-y-1">
            {subtitles.map((subtitle, index) => {
              const isCurrent = currentTime >= subtitle.startTime && currentTime <= subtitle.endTime;
              return (
                <div
                  key={subtitle.id}
                  ref={isCurrent ? currentSubtitleRef : null}
                  className={`p-2 rounded-md text-sm ${isCurrent ? 'bg-primary/10 border border-primary/20' : 'hover:bg-accent'} group relative`}
                >
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{index + 1}</span>
                    <div className=" opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 mr-1"
                      onClick={() => openEditDialog({ id: subtitle.id, text: subtitle.text })}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => openDeleteDialog(subtitle.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <span>{msToTime(subtitle.startTime)} → {msToTime(subtitle.endTime)}</span>
                  </div>
                  <p>{subtitle.text}</p>
                  
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}

      <Dialog open={editDialogOpen} onOpenChange={closeEditDialog}>
        <DialogContent>
          <DialogDescription>Modifique el texto del subtítulo según sea necesario</DialogDescription>
          <DialogHeader>
            <DialogTitle>Editar Subtítulo</DialogTitle>
          </DialogHeader>
          <DebouncedInput
            value={newSubtitleText}
            onChange={setNewSubtitleText}
            className="mt-2"
            debounceTimeout={150}
          />
          <DialogFooter>
            <Button onClick={closeEditDialog}>Cancelar</Button>
            <Button onClick={() => {
              if (editingSubtitle) {
                updateSubtitle(editingSubtitle.id, newSubtitleText);
                closeEditDialog();
              }
            }}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleteDialogOpen} onOpenChange={closeDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Eliminará permanentemente el subtítulo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (subtitleToDelete !== null) {
                deleteSubtitle(subtitleToDelete);
                closeDeleteDialog();
              }
            }}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}