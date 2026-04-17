import { useApp } from "../context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Target, CheckCircle2, Clock } from "lucide-react";

export function Analytics() {
  const { tasks, goals } = useApp();

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Task status distribution
  const statusData = [
    { name: "Completed", value: completedTasks, color: "#10b981" },
    { name: "In Progress", value: inProgressTasks, color: "#3b82f6" },
    { name: "Pending", value: pendingTasks, color: "#6b7280" },
  ];

  // Priority distribution
  const highPriority = tasks.filter((t) => t.priority === "high").length;
  const mediumPriority = tasks.filter((t) => t.priority === "medium").length;
  const lowPriority = tasks.filter((t) => t.priority === "low").length;

  const priorityData = [
    { name: "High", tasks: highPriority, color: "#ef4444" },
    { name: "Medium", tasks: mediumPriority, color: "#f59e0b" },
    { name: "Low", tasks: lowPriority, color: "#10b981" },
  ];

  // Goal progress data
  const goalProgressData = goals.map((goal) => {
    const linkedTasks = tasks.filter((t) => t.goalId === goal.id);
    const completed = linkedTasks.filter((t) => t.status === "completed").length;
    const percentage = linkedTasks.length > 0 ? Math.round((completed / linkedTasks.length) * 100) : 0;

    return {
      name: goal.title.length > 20 ? goal.title.substring(0, 20) + "..." : goal.title,
      progress: percentage,
      completed,
      total: linkedTasks.length,
    };
  });

  // Weekly completion trend (mock data - would need timestamps to calculate real data)
  const weeklyData = [
    { day: "Mon", completed: Math.floor(completedTasks * 0.1) },
    { day: "Tue", completed: Math.floor(completedTasks * 0.15) },
    { day: "Wed", completed: Math.floor(completedTasks * 0.12) },
    { day: "Thu", completed: Math.floor(completedTasks * 0.18) },
    { day: "Fri", completed: Math.floor(completedTasks * 0.25) },
    { day: "Sat", completed: Math.floor(completedTasks * 0.1) },
    { day: "Sun", completed: Math.floor(completedTasks * 0.1) },
  ];

  // Tasks with deadlines
  const tasksWithDeadlines = tasks.filter((t) => t.deadline).length;
  const overdueTasksCount = tasks.filter((t) => {
    if (!t.deadline || t.status === "completed") return false;
    return new Date(t.deadline) < new Date();
  }).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Track your productivity metrics and performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-3xl font-semibold mt-1">{completionRate}%</p>
                <p className="text-xs text-gray-500 mt-1">
                  {completedTasks}/{totalTasks} tasks
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Goals</p>
                <p className="text-3xl font-semibold mt-1">{goals.length}</p>
                <p className="text-xs text-gray-500 mt-1">Total goals</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tasks Completed</p>
                <p className="text-3xl font-semibold mt-1">{completedTasks}</p>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue Tasks</p>
                <p className="text-3xl font-semibold mt-1">{overdueTasksCount}</p>
                <p className="text-xs text-gray-500 mt-1">Need attention</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tasks" radius={[8, 8, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Completion Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Completion Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Goal Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Goal Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {goalProgressData.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No goals to display
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={goalProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm text-gray-600">
                              Progress: {data.progress}%
                            </p>
                            <p className="text-sm text-gray-600">
                              {data.completed}/{data.total} tasks completed
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="progress" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Average Goal Progress</p>
            <p className="text-2xl font-semibold mt-2">
              {goalProgressData.length > 0
                ? Math.round(
                    goalProgressData.reduce((sum, g) => sum + g.progress, 0) /
                      goalProgressData.length
                  )
                : 0}
              %
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">High Priority Tasks</p>
            <p className="text-2xl font-semibold mt-2">{highPriority}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Tasks with Deadlines</p>
            <p className="text-2xl font-semibold mt-2">{tasksWithDeadlines}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
