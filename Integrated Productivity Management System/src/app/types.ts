export type TaskStatus = "pending" | "in-progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string | null;
  goalId: string | null;
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  taskId: string;
  date: string;
  timeSlot: string | null;
}

export interface Notification {
  id: string;
  type: "deadline" | "completion" | "reminder";
  message: string;
  timestamp: string;
  read: boolean;
}
