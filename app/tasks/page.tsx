"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { BottomNav } from "@/components/bottom-nav"
import { Plus, Calendar, Clock, Trash2 } from "lucide-react"
import { getTasks, createTask, updateTask, deleteTask, type TaskOut } from "@/lib/services/task-service"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function TasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<TaskOut[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddTask, setShowAddTask] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [taskDueDate, setTaskDueDate] = useState("")
  const [taskPriority, setTaskPriority] = useState<number>(3)
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsAuthenticated(!!token)

    const fetchTasks = async () => {
      setIsLoading(true)
      try {
        if (token) {
          const fetchedTasks = await getTasks()
          setTasks(fetchedTasks)
        } else {
          // Use mock data for non-authenticated users
          const mockTasks = getMockTasks()
          setTasks(mockTasks)
        }
      } catch (error) {
        console.error("Error fetching tasks:", error)
        toast.error("Failed to load tasks")
        // Fall back to mock data
        const mockTasks = getMockTasks()
        setTasks(mockTasks)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const getMockTasks = (): TaskOut[] => {
    const savedTasks = localStorage.getItem("localTasks")
    if (savedTasks) {
      return JSON.parse(savedTasks)
    }

    // Default mock tasks
    const mockTasks = [
      {
        id: "1",
        user_id: "guest",
        title: "Complete project proposal",
        description: "Finish the draft and send it to the team for review",
        due_date: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
        priority: 4,
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        user_id: "guest",
        title: "Buy groceries",
        description: "Milk, eggs, bread, and vegetables",
        due_date: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
        priority: 2,
        created_at: new Date().toISOString(),
      },
      {
        id: "3",
        user_id: "guest",
        title: "Schedule dentist appointment",
        description: null,
        due_date: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
        priority: 3,
        created_at: new Date().toISOString(),
      },
    ]

    localStorage.setItem("localTasks", JSON.stringify(mockTasks))
    return mockTasks
  }

  const handleAddTask = async () => {
    if (!taskTitle.trim()) {
      toast.error("Task title is required")
      return
    }

    try {
      if (isAuthenticated) {
        // Add task via API
        const newTask = await createTask({
          title: taskTitle,
          description: taskDescription || null,
          due_date: taskDueDate || null,
          priority: taskPriority,
        })
        setTasks([...tasks, newTask])
      } else {
        // Add task to local storage
        const newTask: TaskOut = {
          id: Date.now().toString(),
          user_id: "guest",
          title: taskTitle,
          description: taskDescription || null,
          due_date: taskDueDate || null,
          priority: taskPriority,
          created_at: new Date().toISOString(),
        }
        const updatedTasks = [...tasks, newTask]
        localStorage.setItem("localTasks", JSON.stringify(updatedTasks))
        setTasks(updatedTasks)
      }

      toast.success("Task added successfully")
      setShowAddTask(false)
      resetTaskForm()
    } catch (error) {
      console.error("Error adding task:", error)
      toast.error("Failed to add task")
    }
  }

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      const taskToUpdate = tasks.find((task) => task.id === taskId)
      if (!taskToUpdate) return

      if (isAuthenticated) {
        // Update task via API
        await updateTask({
          task_id: taskId,
          title: taskToUpdate.title,
          description: taskToUpdate.description,
          due_date: taskToUpdate.due_date,
          priority: taskToUpdate.priority,
        })
      }

      // Update local state
      const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, completed } : task))

      if (!isAuthenticated) {
        localStorage.setItem("localTasks", JSON.stringify(updatedTasks))
      }

      setTasks(updatedTasks)
    } catch (error) {
      console.error("Error updating task:", error)
      toast.error("Failed to update task")
    }
  }

  const handleDeleteTask = async () => {
    if (!deleteTaskId) return

    try {
      if (isAuthenticated) {
        // Delete task via API
        await deleteTask(deleteTaskId)
      }

      // Update local state
      const updatedTasks = tasks.filter((task) => task.id !== deleteTaskId)

      if (!isAuthenticated) {
        localStorage.setItem("localTasks", JSON.stringify(updatedTasks))
      }

      setTasks(updatedTasks)
      toast.success("Task deleted successfully")
    } catch (error) {
      console.error("Error deleting task:", error)
      toast.error("Failed to delete task")
    } finally {
      setDeleteTaskId(null)
    }
  }

  const resetTaskForm = () => {
    setTaskTitle("")
    setTaskDescription("")
    setTaskDueDate("")
    setTaskPriority(3)
  }

  const handleLogin = () => {
    router.push("/auth/login")
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null

    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const getPriorityLabel = (priority: number | null) => {
    if (!priority) return "Medium"

    switch (priority) {
      case 1:
        return "Very Low"
      case 2:
        return "Low"
      case 3:
        return "Medium"
      case 4:
        return "High"
      case 5:
        return "Very High"
      default:
        return "Medium"
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-16">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold">Tasks</h1>
      </div>

      <div className="flex-1 p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No tasks yet</p>
            <Button onClick={() => setShowAddTask(true)}>Add Your First Task</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-4 bg-background">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={(checked) => handleToggleTask(task.id, !!checked)}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={`task-${task.id}`}
                      className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                    >
                      {task.title}
                    </label>
                    {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                    <div className="flex items-center gap-4 mt-2">
                      {task.due_date && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(task.due_date)}
                        </div>
                      )}
                      {task.priority && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {getPriorityLabel(task.priority)}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleteTaskId(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-20 right-4">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg"
          onClick={() => setShowAddTask(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <Sheet open={showAddTask} onOpenChange={setShowAddTask}>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Add New Task</SheetTitle>
          </SheetHeader>
          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                placeholder="Task title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-description">Description (Optional)</Label>
              <Input
                id="task-description"
                placeholder="Task description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-due-date">Due Date (Optional)</Label>
              <Input
                id="task-due-date"
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-priority">Priority</Label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((priority) => (
                  <Button
                    key={priority}
                    type="button"
                    variant={taskPriority === priority ? "default" : "outline-solid"}
                    onClick={() => setTaskPriority(priority)}
                  >
                    {priority}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">1 = Very Low, 5 = Very High</p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddTask(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTask}>Add Task</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteTaskId} onOpenChange={(open) => !open && setDeleteTaskId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign in required</AlertDialogTitle>
            <AlertDialogDescription>You need to sign in to access premium features.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogin}>Sign In</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav currentPath="/tasks" />
    </div>
  )
}
