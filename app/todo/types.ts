export type Task = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: "planned" | "in_progress" | "done" | "on_hold";
  due_date: string | null;
  completion: number;
  category?: string;
  created_at: string;
};
