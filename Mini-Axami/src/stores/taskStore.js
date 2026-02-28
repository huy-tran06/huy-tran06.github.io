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

            const { data, error } = await supabase
                .from("tasks")
                .select("*")
                .eq("unit_id", unitId)
                .order("created_at", { ascending: false})
            
            if (!error) {
                this.tasks = data
                this.tasksByUnit[unitId] = data
            }

            this.loading = false
            return { data, error }
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
            } else {
                insertPayload.status = "created"
            }
            
            const { data, error } = await supabase
                .from("tasks")
                .insert(insertPayload)
                .select()

            if(!error && data){
                this.tasks.unshift(data[0])

                const unitId = data[0].unit_id
                const existingTasks = this.tasksByUnit[unitId] || []
                this.tasksByUnit[unitId] = [data[0], ...existingTasks]
            }

            return { data, error }
        },

        async approveSuggestedTask(taskId, unitId) {
            const auth = useAuthStore()

            if (!auth.user || auth.role !== "customer") {
                return {
                    data: null,
                    error: { message: "Only customers can approve suggested tasks." }
                }
            }

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
        }
    }
})
