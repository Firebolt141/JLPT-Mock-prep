import {
  Timestamp,
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import type { ExamResult } from '@/src/types/exam';
import { db } from '@/src/lib/firebase';

const COLLECTION_NAME = 'examAttempts';

export interface CloudExamAttempt extends ExamResult {
  id: string;
  createdAt?: string;
  teamName?: string;
}

function mapDocToAttempt(doc: QueryDocumentSnapshot): CloudExamAttempt {
  const data = doc.data() as Record<string, unknown>;

  const createdAt = data.createdAt;
  const normalizedCreatedAt =
    createdAt instanceof Timestamp ? createdAt.toDate().toISOString() : undefined;

  return {
    id: doc.id,
    participantName: String(data.participantName ?? ''),
    email: String(data.email ?? ''),
    examId: String(data.examId ?? ''),
    examLevel: String(data.examLevel ?? 'N5') as ExamResult['examLevel'],
    answers: (data.answers ?? {}) as Record<string, string>,
    completedAt: String(data.completedAt ?? normalizedCreatedAt ?? new Date().toISOString()),
    scores: data.scores as ExamResult['scores'],
    teamName: data.teamName ? String(data.teamName) : undefined,
    createdAt: normalizedCreatedAt,
  };
}

export async function saveAttemptToCloud(attempt: ExamResult): Promise<void> {
  if (!db) return;

  await addDoc(collection(db, COLLECTION_NAME), {
    ...attempt,
    createdAt: Timestamp.now(),
  });
}

export function subscribeToCloudAttempts(
  callback: (attempts: CloudExamAttempt[]) => void,
  maxItems = 500
): (() => void) | null {
  if (!db) return null;

  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('createdAt', 'desc'),
    limit(maxItems)
  );

  return onSnapshot(q, (snapshot) => {
    const attempts = snapshot.docs.map(mapDocToAttempt);
    callback(attempts);
  });
}
