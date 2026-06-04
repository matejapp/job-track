// BACKEND MISMATCH: No Document entity exists in the backend yet.
// These functions will throw an ApiError until the backend implements the document model.
// Tracked endpoints:
//   GET    /api/documents      — list all documents for the user
//   POST   /api/documents      — upload a document (multipart/form-data)
//   DELETE /api/documents/{id} — delete a document

import { apiRequest } from './httpClient';
import type { Document } from '../types';

interface GetDocumentsResponse {
  documents?: Document[]
}

interface GetDocumentResponse {
  document?: Document
}

export async function getDocuments(): Promise<Document[]> {
  const data = await apiRequest<GetDocumentsResponse>('/api/documents');
  return data.documents ?? [];
}

// Note: uploadDocument sends FormData — do not set Content-Type manually;
// the browser will set it with the correct multipart boundary.
export async function uploadDocument(formData: FormData): Promise<Document> {
  const data = await apiRequest<GetDocumentResponse>('/api/documents', {
    method: 'POST',
    // FormData must NOT be JSON-serialized; pass as-is via a raw fetch workaround.
    // TODO: apiRequest currently serializes body to JSON. When the backend document
    // endpoint is implemented, extend ApiRequestOptions to support raw FormData bodies.
    body: formData as unknown,
  });
  return data.document!;
}

export async function deleteDocument(id: string): Promise<void> {
  await apiRequest(`/api/documents/${id}`, {
    method: 'DELETE',
  });
}
