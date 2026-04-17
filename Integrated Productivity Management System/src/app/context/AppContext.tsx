import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Task, Goal, CalendarEvent, Notification } from "../types";
import { toast } from "sonner";

interface AppContextType {
  tasks: Task[];
  goals: Goal[];
  calendarEvents: CalendarEvent[];
  notifications: Notification[];
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addGoal: (goal: Omit<Goal, "id" | "createdAt">) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addCalendarEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateCalendarEvent: (id: string, event: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

const generateId = () => Math.random().toString(36).substring(2, 9);

// Demo data for initial load
const demoTasks: Task[] = [
  {
    id: "demo1",
    title: "Review project proposal",
    description: "Review and provide feedback on Q2 project proposal",
    status: "in-progress",
    priority: "high",
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    goalId: "goal1",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo2",
    title: "Update documentation",
    description: "Update API documentation with latest changes",
    status: "pending",
    priority: "medium",
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    goalId: "goal1",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo3",
    title: "Team standup meeting",
    description: "Daily team sync to discuss progress and blockers",
    status: "completed",
    priority: "medium",
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    goalId: null,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo4",
    title: "Design system updates",
    description: "Implement new color palette and typography",
    status: "in-progress",
    priority: "high",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    goalId: "goal2",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo5",
    title: "Client presentation",
    description: "Prepare and deliver project status presentation",
    status: "pending",
    priority: "high",
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    goalId: "goal1",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo6",
    title: "Code review",
    description: "Review pull requests from team members",
    status: "completed",
    priority: "low",
    deadline: null,
    goalId: null,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const demoGoals: Goal[] = [
  {
    id: "goal1",
    title: "Q2 Product Launch",
    description: "Successfully launch the new product version with all planned features",
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "goal2",
    title: "Improve Design System",
    description: "Modernize and document the design system for better consistency",
    targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const demoNotifications: Notification[] = [
  {
    id: "notif1",
    type: "completion",
    message: 'Task "Code review" completed!',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "notif2",
    type: "deadline",
    message: 'Task "Review project proposal" is due soon!',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      return JSON.parse(saved);
    }
    // Return demo data on first load
    localStorage.setItem("tasks", JSON.stringify(demoTasks));
    return demoTasks;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem("goals");
    if (saved) {
      return JSON.parse(saved);
    }
    localStorage.setItem("goals", JSON.stringify(demoGoals));
    return demoGoals;
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem("calendarEvents");
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem("notifications");
    if (saved) {
      return JSON.parse(saved);
    }
    localStorage.setItem("notifications", JSON.stringify(demoNotifications));
    return demoNotifications;
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Check for upcoming deadlines
  useEffect(() => {
    const checkDeadlines = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      tasks.forEach((task) => {
        if (task.deadline && task.status !== "completed") {
          const deadline = new Date(task.deadline);
          const timeDiff = deadline.getTime() - now.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

          if (daysDiff === 1) {
            const existingNotif = notifications.find(
              (n) => n.message.includes(task.title) && n.type === "deadline"
            );
            if (!existingNotif) {
              addNotification({
                type: "deadline",
                message: `Task "${task.title}" is due tomorrow!`,
                read: false,
              });
            }
          }
        }
      });
    };

    checkDeadlines();
    const interval = setInterval(checkDeadlines, 3600000); // Check every hour
    return () => clearInterval(interval);
  }, [tasks, notifications]);

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
    toast.success("Task created successfully");
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const updatedTask = { ...task, ...updates };
          
          // Check if task was just completed
          if (updates.status === "completed" && task.status !== "completed") {
            addNotification({
              type: "completion",
              message: `Task "${task.title}" completed!`,
              read: false,
            });
            toast.success("Task completed! 🎉");
          }
          
          return updatedTask;
        }
        return task;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    setCalendarEvents((prev) => prev.filter((event) => event.taskId !== id));
    toast.success("Task deleted");
  };

  const addGoal = (goal: Omit<Goal, "id" | "createdAt">) => {
    const newGoal: Goal = {
      ...goal,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [...prev, newGoal]);
    toast.success("Goal created successfully");
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal))
    );
    toast.success("Goal updated");
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
    // Remove goal association from tasks
    setTasks((prev) =>
      prev.map((task) =>
        task.goalId === id ? { ...task, goalId: null } : task
      )
    );
    toast.success("Goal deleted");
  };

  const addCalendarEvent = (event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: generateId(),
    };
    setCalendarEvents((prev) => [...prev, newEvent]);
  };

  const updateCalendarEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setCalendarEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...updates } : event))
    );
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const addNotification = (notification: Omit<Notification, "id" | "timestamp">) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        goals,
        calendarEvents,
        notifications,
        addTask,
        updateTask,
        deleteTask,
        addGoal,
        updateGoal,
        deleteGoal,
        addCalendarEvent,
        updateCalendarEvent,
        deleteCalendarEvent,
        addNotification,
        markNotificationAsRead,
        clearAllNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};