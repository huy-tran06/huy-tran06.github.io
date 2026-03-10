import { defineStore } from "pinia"
import { supabase } from "../lib/supabase"
import { useAuthStore } from "./auth"

export const useTaskStore = defineStore("tasks", {
    state: () => ({
        tasks: [],
        tasksByUnit: {},
        loading: false
    }),

    actions: {
        async fetchTasks(unitId) {
            this.loading = true

            try {
                const { data, error } = await supabase
                    .from("tasks")
                    .select("*")
                    .eq("unit_id", unitId)
                    .order("created_at", { ascending: false })

                if (!error) {
                    const unitTasks = Array.isArray(data) ? [...data] : []
                    this.tasks = [...unitTasks]
                    this.tasksByUnit[unitId] = unitTasks
                }

                return { data, error }
            } catch (error) {
                return {
                    data: null,
                    error: { message: error?.message || "Could not load tasks." }
                }
            } finally {
                this.loading = false
            }
        },

        async createTask(payload){
            const auth = useAuthStore()
            if (!auth.user) {
                return {
                    data: null,
                    error: { message: "You must be logged in to submit a task." }
                }
            }

            const isCustomer = auth.role === "customer"
            const isWorker = auth.role === "worker"

            if (!isCustomer && !isWorker) {
                return {
                    data: null,
                    error: { message: "Your role is not allowed to submit tasks." }
                }
            }

            const insertPayload = {
                ...payload,
                created_by: auth.user.id
            }

            if (isWorker) {
                insertPayload.status = "suggested"
                insertPayload.suggested_by = auth.user.id
                insertPayload.assigned_worker_id = auth.user.id
            } else {
                insertPayload.status = "created"
            }
            
            try {
                const { data, error } = await supabase
                    .from("tasks")
                    .insert(insertPayload)
                    .select()

                if (!error && data) {
                    this.tasks = [data[0], ...this.tasks]

                    const unitId = data[0].unit_id
                    const existingTasks = this.tasksByUnit[unitId] || []
                    this.tasksByUnit[unitId] = [data[0], ...existingTasks]
                }

                return { data, error }
            } catch (error) {
                return {
                    data: null,
                    error: { message: error?.message || "Could not create task." }
                }
            }
        },

        async approveSuggestedTask(taskId, unitId) {
            const auth = useAuthStore()

            if (!auth.user || auth.role !== "customer") {
                return {
                    data: null,
                    error: { message: "Only customers can approve suggested tasks." }
                }
            }

            try {
                const { data, error } = await supabase
                    .from("tasks")
                    .update({ status: "in_progress" })
                    .eq("id", taskId)
                    .eq("unit_id", unitId)
                    .eq("status", "suggested")
                    .select()
                    .single()

                if (!error && data) {
                    const unitTasks = this.tasksByUnit[unitId] || []
                    this.tasksByUnit[unitId] = unitTasks.map((task) =>
                        task.id === taskId ? data : task
                    )

                    this.tasks = this.tasks.map((task) =>
                        task.id === taskId ? data : task
                    )
                }

                return { data, error }
            } catch (error) {
                return {
                    data: null,
                    error: { message: error?.message || "Could not approve task." }
                }
            }
        },

        async updateTask(taskId, unitId, updates) {
            try {
                const { data, error } = await supabase
                    .from("tasks")
                    .update(updates)
                    .eq("id", taskId)
                    .eq("unit_id", unitId)
                    .select()
                    .maybeSingle()

                if (!error && data) {
                    const unitTasks = this.tasksByUnit[unitId] || []
                    this.tasksByUnit[unitId] = unitTasks.map((task) =>
                        task.id === taskId ? data : task
                    )

                    this.tasks = this.tasks.map((task) =>
                        task.id === taskId ? data : task
                    )
                }

                if (!error && !data) {
                    return {
                        data: null,
                        error: {
                            message: "Task was not updated. You may not have permission for this task."
                        }
                    }
                }

                return { data, error }
            } catch (error) {
                return {
                    data: null,
                    error: { message: error?.message || "Could not update task." }
                }
            }
        },

        async deleteTask(taskId, unitId) {
            const auth = useAuthStore()

            if (!auth.user || auth.role !== "customer") {
                return {
                    data: null,
                    error: { message: "Only customers can delete tasks." }
                }
            }

            try {
                const { data, error } = await supabase
                    .from("tasks")
                    .delete()
                    .eq("id", taskId)
                    .eq("unit_id", unitId)
                    .neq("status", "suggested")
                    .select()
                    .maybeSingle()

                if (!error && data) {
                    const unitTasks = this.tasksByUnit[unitId] || []
                    this.tasksByUnit[unitId] = unitTasks.filter((task) => task.id !== taskId)
                    this.tasks = this.tasks.filter((task) => task.id !== taskId)
                }

                if (!error && !data) {
                    return {
                        data: null,
                        error: {
                            message: "Task was not deleted. You may not have permission for this task."
                        }
                    }
                }

                return { data, error }
            } catch (error) {
                return {
                    data: null,
                    error: { message: error?.message || "Could not delete task." }
                }
            }
        }
    }
})
