import { apiRequest } from './httpClient';
import type { Note, CreateNoteDto } from '../types';

interface GetNotesResponse {
  notes?: Note[]
}

interface GetNoteResponse {
  note?: Note
}

export const getNotesByJob = async (jobId: string): Promise<Note[]> => {
  const data = await apiRequest<GetNotesResponse>(`/api/jobapplications/${jobId}/notes`);
  return data.notes ?? [];
};

export const createNote = async (jobId: string, dto: CreateNoteDto): Promise<unknown> => {
  return apiRequest(`/api/jobapplications/${jobId}/notes`, {
    method: 'POST',
    body: { Content: dto.content },
  });
};

export const updateNote = async (jobId: string, noteId: string, dto: CreateNoteDto): Promise<Note> => {
  const data = await apiRequest<GetNoteResponse>(`/api/jobapplications/${jobId}/notes/${noteId}`, {
    method: 'PUT',
    body: { Content: dto.content },
  });
  return data.note!;
};

export const deleteNote = async (jobId: string, noteId: string): Promise<void> => {
  await apiRequest(`/api/jobapplications/${jobId}/notes/${noteId}`, {
    method: 'DELETE',
  });
};
