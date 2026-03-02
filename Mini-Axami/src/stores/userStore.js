import { defineStore } from "pinia"
import { supabase } from "../lib/supabase"

export const useUserStore = defineStore("users", {
    state: () => ({
        workers: [],
        workersLoading: false,
        workersError: ""
    }),

  actions: {
    async fetchWorkers() {
        if (this.workersLoading) {
            return { data: this.workers, error: null }
        }

        this.workersLoading = true
        this.workersError = ""

        const { data, error } = await supabase
            .from("users")
            .select("id, full_name")
            .eq("role", "worker")
            .order("full_name", { ascending: true })

        if (!error) {
            this.workers = data || []
        } else {
            this.workers = []
            this.workersError = error.message || "Could not load workers."
        }

        this.workersLoading = false
        return { data, error }
    }
  }
})
