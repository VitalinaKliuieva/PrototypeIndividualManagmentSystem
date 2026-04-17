import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Progress } from "../components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Plus, MoreVertical, Target, CheckCircle2, Clock } from "lucide-react";
import { Goal } from "../types";

export function Goals() {
  const { goals, tasks, addGoal, updateGoal, deleteGoal } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetDate: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      targetDate: "",
    });
    setEditingGoal(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingGoal) {
      updateGoal(editingGoal.id, formData);
    } else {
      addGoal(formData);
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      targetDate: goal.targetDate,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (goalId: string) => {
    if (confirm("Are you sure you want to delete this goal? Tasks linked to this goal will not be deleted.")) {
      deleteGoal(goalId);
    }
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const getGoalProgress = (goalId: string) => {
    const linkedTasks = tasks.filter((t) => t.goalId === goalId);
    if (linkedTasks.length === 0) return { percentage: 0, completed: 0, total: 0 };

    const completed = linkedTasks.filter((t) => t.status === "completed").length;
    const percentage = Math.round((completed / linkedTasks.length) * 100);

    return { percentage, completed, total: linkedTasks.length };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysRemaining = (targetDate: string) => {
    const now = new Date();
    const target = new Date(targetDate);
    const diff = target.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Goal Tracker</h1>
          <p className="text-gray-600 mt-1">Track progress toward your goals</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingGoal ? "Edit Goal" : "Create New Goal"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Complete Project X"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your goal..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="targetDate">Target Date</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => handleDialogChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingGoal ? "Update Goal" : "Create Goal"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No goals yet. Create your first goal to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const progress = getGoalProgress(goal.id);
            const daysRemaining = getDaysRemaining(goal.targetDate);
            const isOverdue = daysRemaining < 0;
            const linkedTasks = tasks.filter((t) => t.goalId === goal.id);

            return (
              <Card key={goal.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Target className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{goal.title}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(goal)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(goal.id)}
                          className="text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-2xl font-semibold text-purple-600">
                        {progress.percentage}%
                      </span>
                    </div>
                    <Progress value={progress.percentage} className="h-3" />
                    <p className="text-xs text-gray-600 mt-2">
                      {progress.completed} of {progress.total} tasks completed
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Tasks</p>
                        <p className="text-sm font-semibold">{linkedTasks.length}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded ${isOverdue ? "bg-red-100" : "bg-green-100"}`}>
                        <Clock className={`w-4 h-4 ${isOverdue ? "text-red-600" : "text-green-600"}`} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">
                          {isOverdue ? "Overdue" : "Days left"}
                        </p>
                        <p className={`text-sm font-semibold ${isOverdue ? "text-red-600" : ""}`}>
                          {Math.abs(daysRemaining)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Target Date */}
                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-600">Target Date</p>
                    <p className="text-sm font-medium mt-1">{formatDate(goal.targetDate)}</p>
                  </div>

                  {/* Recent Tasks */}
                  {linkedTasks.length > 0 && (
                    <div className="pt-4 border-t">
                      <p className="text-xs text-gray-600 mb-2">Linked Tasks</p>
                      <div className="space-y-1">
                        {linkedTasks.slice(0, 3).map((task) => (
                          <div key={task.id} className="flex items-center gap-2 text-sm">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                task.status === "completed"
                                  ? "bg-green-500"
                                  : task.status === "in-progress"
                                  ? "bg-blue-500"
                                  : "bg-gray-400"
                              }`}
                            />
                            <span className="text-gray-700 truncate">{task.title}</span>
                          </div>
                        ))}
                        {linkedTasks.length > 3 && (
                          <p className="text-xs text-gray-500 pl-4">
                            +{linkedTasks.length - 3} more tasks
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
