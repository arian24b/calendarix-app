import { apiRequest } from "../api-client"

export interface HabitCreate {
  title: string
  frequency: string
  description?: string | null
  settings?: Record<string, any> | null
}

export interface HabitOut {
  id: string
  user_id: string
  title: string
  frequency: string
  description?: string | null
  settings?: Record<string, any> | null
  created_at: string
  updated_at?: string | null
}

export interface HabitUpdate {
  habit_id: string
  title?: string | null
  frequency?: string | null
  description?: string | null
  settings?: Record<string, any> | null
}

export interface HabitDelete {
  habit_id: string
}

export async function getHabits(): Promise<HabitOut[]> {
  return apiRequest<HabitOut[]>({
    method: "GET",
    path: "/v1/habits/",
    requiresAuth: true,
  })
}

export async function createHabit(data: HabitCreate): Promise<HabitOut> {
  return apiRequest<HabitOut>({
    method: "POST",
    path: "/v1/habits/",
    body: data,
    requiresAuth: true,
  })
}

export async function getHabit(habitId: string): Promise<HabitOut> {
  return apiRequest<HabitOut>({
    method: "POST",
    path: "/v1/habits/get",
    body: { habit_id: habitId },
    requiresAuth: true,
  })
}

export async function updateHabit(data: HabitUpdate): Promise<HabitOut> {
  return apiRequest<HabitOut>({
    method: "POST",
    path: "/v1/habits/update",
    body: data,
    requiresAuth: true,
  })
}

export async function deleteHabit(habitId: string): Promise<{ id: string }> {
  return apiRequest<{ id: string }>({
    method: "POST",
    path: "/v1/habits/delete",
    body: { habit_id: habitId },
    requiresAuth: true,
  })
}
