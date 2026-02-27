import { defineStore } from "pinia"
import { supabase } from "../lib/supabase"
import { useAuthStore } from "./auth"

export const useTaskStore = defineStore("tasks", {
    state: () => ({
        tasks: [],
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
            }

            this.loading = false
            return { data, error }
        },

        async createTask(payload){
            const auth = useAuthStore()
            
            const { data, error } = await supabase
                .from("tasks")
                .insert({
                    ...payload,
                    created_by: auth.user.id,
                    status: "created"
                })
                .select()

            if(!error && data){
                this.tasks.unshift(data[0])
            }

            return { data, error }
        }
    }
})