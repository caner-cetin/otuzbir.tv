const SUBMISSION_COUNTER_KEY = 'submissionCounter';
const SUBMISSIONS_KEY = 'submissions';

export interface StoredSubmission {
  localId: number;
  globalId: number;
  token: string;
}

export const getNextSubmissionId = (): number => {
  const currentCounter = localStorage.getItem(SUBMISSION_COUNTER_KEY);
  const nextId = currentCounter ? parseInt(currentCounter, 10) + 1 : 1;
  localStorage.setItem(SUBMISSION_COUNTER_KEY, nextId.toString());
  return nextId;
};

export const saveSubmission = (submission: StoredSubmission): void => {
  const submissions = getStoredSubmissions();
  submissions.push(submission);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
};

export const getStoredSubmissions = (): StoredSubmission[] => {
  const storedSubmissions = localStorage.getItem(SUBMISSIONS_KEY);
  return storedSubmissions ? JSON.parse(storedSubmissions) : [];
};

export const clearStoredSubmissions = (): void => {
  localStorage.removeItem(SUBMISSIONS_KEY);
  localStorage.removeItem(SUBMISSION_COUNTER_KEY);
};