import { defineStore } from "pinia"
import { supabase } from "../lib/supabase"

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null,
        role: null,
        loading: true
    }),
    actions: {
        async init() {
            this.loading = true
            const getUser = await supabase.auth.getUser()
            this.user = getUser.data.user ?? null

            await this.fetchRoles()

            supabase.auth.onAuthStateChange(async (_event, session) => {
                this.user = session?.user ?? null
                await this.fetchRoles()
            })

            this.loading = false
        },

        async fetchRoles() {
            if(!this.user) {
                this.role = null
                return
            }

            const result = await supabase
                .from("users")
                .select("role")
                .eq("id", this.user.id)
                .single()

            const data = result.data
            const error = result.error

            if(!error && data) {
                this.role = data.role
            }
            else {
                this.role = null
            }
        },

        async logout() {
            await supabase.auth.signOut()
        }
    }
})