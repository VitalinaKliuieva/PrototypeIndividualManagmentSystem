import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Task } from "../types";

const ItemTypes = {
  TASK: "task",
};

interface DraggableTaskProps {
  task: Task;
}

function DraggableTask({ task }: DraggableTaskProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { taskId: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div
      ref={drag}
      className={`p-2 mb-2 border rounded cursor-move hover:shadow-sm transition-shadow ${
        isDragging ? "opacity-50" : "opacity-100"
      } bg-white`}
    >
      <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
      <Badge variant="outline" className={`${getPriorityColor(task.priority)} mt-1 text-xs`}>
        {task.priority}
      </Badge>
    </div>
  );
}

interface CalendarDayProps {
  date: Date;
  isCurrentMonth: boolean;
  events: Task[];
  onDrop: (taskId: string, date: string) => void;
}

function CalendarDay({ date, isCurrentMonth, events, onDrop }: CalendarDayProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.TASK,
    drop: (item: { taskId: string }) => {
      onDrop(item.taskId, date.toISOString().split("T")[0]);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const today = new Date();
  const isToday =
    date.toDateString() === today.toDateString();

  return (
    <div
      ref={drop}
      className={`min-h-[120px] p-2 border border-gray-200 ${
        !isCurrentMonth ? "bg-gray-50" : "bg-white"
      } ${isOver ? "bg-blue-50" : ""} ${isToday ? "ring-2 ring-blue-500" : ""}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-sm ${
            isToday
              ? "w-6 h-6 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold"
              : isCurrentMonth
              ? "text-gray-900"
              : "text-gray-400"
          }`}
        >
          {date.getDate()}
        </span>
      </div>
      <div className="space-y-1">
        {events.slice(0, 3).map((task) => (
          <div
            key={task.id}
            className="text-xs p-1.5 bg-blue-100 text-blue-700 rounded truncate"
          >
            {task.title}
          </div>
        ))}
        {events.length > 3 && (
          <div className="text-xs text-gray-500 text-center">+{events.length - 3} more</div>
        )}
      </div>
    </div>
  );
}

export function Calendar() {
  const { tasks, calendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent } =
    useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const handleDrop = (taskId: string, dateString: string) => {
    // Check if event already exists for this task
    const existingEvent = calendarEvents.find((e) => e.taskId === taskId);
    
    if (existingEvent) {
      updateCalendarEvent(existingEvent.id, { date: dateString });
    } else {
      addCalendarEvent({
        taskId,
        date: dateString,
        timeSlot: null,
      });
    }

    // Also update task deadline if not set
    const task = tasks.find((t) => t.id === taskId);
    if (task && !task.deadline) {
      // This would require adding updateTask to the context, which is already there
    }
  };

  // Generate calendar days
  const calendarDays: Date[] = [];
  
  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push(new Date(year, month - 1, prevMonthLastDay - i));
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(year, month, i));
  }
  
  // Next month days
  const remainingDays = 42 - calendarDays.length; // 6 weeks * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push(new Date(year, month + 1, i));
  }

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    const eventTaskIds = calendarEvents
      .filter((e) => e.date === dateString)
      .map((e) => e.taskId);
    
    return tasks.filter((t) => eventTaskIds.includes(t.id));
  };

  // Unscheduled tasks
  const scheduledTaskIds = new Set(calendarEvents.map((e) => e.taskId));
  const unscheduledTasks = tasks.filter(
    (t) => !scheduledTaskIds.has(t.id) && t.status !== "completed"
  );

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Calendar</h1>
            <p className="text-gray-600 mt-1">Schedule and organize your tasks</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar Grid */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {monthNames[month]} {year}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={previousMonth}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button variant="outline" size="icon" onClick={nextMonth}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200">
                {/* Week day headers */}
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="bg-gray-50 p-2 text-center text-sm font-semibold text-gray-700"
                  >
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {calendarDays.map((date, index) => (
                  <CalendarDay
                    key={index}
                    date={date}
                    isCurrentMonth={date.getMonth() === month}
                    events={getEventsForDate(date)}
                    onDrop={handleDrop}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Unscheduled Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Unscheduled Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Drag tasks to the calendar to schedule them
              </p>
              {unscheduledTasks.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  All tasks are scheduled!
                </p>
              ) : (
                <div className="space-y-2">
                  {unscheduledTasks.map((task) => (
                    <DraggableTask key={task.id} task={task} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DndProvider>
  );
}
