import { apiRequest } from "../api-client"

export interface TaskCreate {
  title: string
  description?: string | null
  due_date?: string | null
  priority?: number | null
}

export interface TaskOut {
  id: string
  user_id: string
  title: string
  description?: string | null
  due_date?: string | null
  priority?: number | null
  created_at: string
  updated_at?: string | null
}

export interface TaskUpdate {
  task_id: string
  title?: string | null
  description?: string | null
  due_date?: string | null
  priority?: number | null
}

export interface TaskDelete {
  task_id: string
}

export async function getTasks(): Promise<TaskOut[]> {
  return apiRequest<TaskOut[]>({
    method: "GET",
    path: "/v1/tasks/",
    requiresAuth: true,
  })
}

export async function createTask(data: TaskCreate): Promise<TaskOut> {
  return apiRequest<TaskOut>({
    method: "POST",
    path: "/v1/tasks/",
    body: data,
    requiresAuth: true,
  })
}

export async function getTask(taskId: string): Promise<TaskOut> {
  return apiRequest<TaskOut>({
    method: "POST",
    path: "/v1/tasks/get",
    body: { task_id: taskId },
    requiresAuth: true,
  })
}

export async function updateTask(data: TaskUpdate): Promise<TaskOut> {
  return apiRequest<TaskOut>({
    method: "POST",
    path: "/v1/tasks/update",
    body: data,
    requiresAuth: true,
  })
}

export async function deleteTask(taskId: string): Promise<{ id: string }> {
  return apiRequest<{ id: string }>({
    method: "POST",
    path: "/v1/tasks/delete",
    body: { task_id: taskId },
    requiresAuth: true,
  })
}
