// File: utils/threadStore.ts
let threadId: string | null = null;

export function getThreadId(): string | null {
  return threadId;
}

export function saveThreadId(id: string): void {
  threadId = id;
}
