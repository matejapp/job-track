import { apiRequest } from './httpClient';
import type { Document } from '../types';

export async function getDocuments(): Promise<Document[]> {
  const data = await apiRequest<{ data: Document[] }>('/api/documents');
  return data.data ?? [];
}

export async function uploadDocument(formData: FormData): Promise<Document> {
  const data = await apiRequest<{ data: Document }>('/api/documents', {
    method: 'POST',
    body: formData,
  });
  return data.data;
}

export async function deleteDocument(id: string): Promise<void> {
  await apiRequest(`/api/documents/${id}`, { method: 'DELETE' });
}
