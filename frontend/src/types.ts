export interface UserData {
  id: number;
  username: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  banned: boolean;
  banReason: string | null;
}

export interface VideoInfo {
  files: string[];
  title: string;
  source: string;
}
