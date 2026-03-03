import { defineStore } from "pinia"
import { supabase } from "../lib/supabase"

export const useUserStore = defineStore("users", {
    state: () => ({
        workers: [],
        workersLoading: false,
        workersError: "",
        usersById: {}
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
    },

    async fetchUsersByIds(ids = []) {
        const normalizedIds = (ids || [])
            .filter(Boolean)
            .map((id) => String(id))
        const uniqueIds = [...new Set(normalizedIds)]

        if (!uniqueIds.length) {
            return { data: [], error: null }
        }

        const missingIds = uniqueIds.filter((id) => !this.usersById[id])

        if (!missingIds.length) {
            return {
                data: uniqueIds.map((id) => this.usersById[id]).filter(Boolean),
                error: null
            }
        }

        const { data, error } = await supabase
            .from("users")
            .select("id, full_name")
            .in("id", missingIds)

        if (error) {
            return { data: null, error }
        }

        for (const user of data || []) {
            this.usersById[user.id] = user
        }

        return {
            data: uniqueIds.map((id) => this.usersById[id]).filter(Boolean),
            error: null
        }
    },

    getUserDisplayName(userId) {
        if (!userId) {
            return "Not set"
        }

        return this.usersById[userId]?.full_name || "Unknown user"
    }
  }
})
