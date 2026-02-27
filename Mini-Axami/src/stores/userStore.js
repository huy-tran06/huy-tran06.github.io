import { defineStore } from "pinia"
import { supabase } from "../lib/supabase"

export const useUserStore = defineStore("users", {
    state: () => ({
        workers: []
    }),

  actions: {
    async fetchWorkers() {

        const { data, error } = await supabase
            .from("users")
            .select("id, full_name")
            .eq("role", "worker")

        if (!error) {
            this.workers = data
        }

        return { data, error }
    }
  }
})