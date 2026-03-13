import { defineStore } from "pinia"
import { supabase } from "../lib/supabase"

let authStateSubscription = null

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null,
        role: null,
        loading: true
    }),
    actions: {
        async init() {
            this.loading = true
            try {
                const getUser = await supabase.auth.getUser()
                this.user = getUser.data.user ?? null

                await this.fetchRoles()

                if (!authStateSubscription) {
                    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
                        this.user = session?.user ?? null
                        this.role = null

                        globalThis.setTimeout(() => {
                            this.fetchRoles()
                        }, 0)
                    })

                    authStateSubscription = data.subscription
                }
            } catch (_error) {
                this.user = null
                this.role = null
            } finally {
                this.loading = false
            }
        },

        async fetchRoles() {
            if(!this.user) {
                this.role = null
                return
            }

            try {
                const result = await supabase
                    .from("users")
                    .select("role")
                    .eq("id", this.user.id)
                    .single()

                const data = result.data
                const error = result.error

                if(!error && data) {
                    this.role = data.role
                    return
                }
            } catch (_error) {
            }

            this.role = null
        },

        async logout() {
            try {
                await supabase.auth.signOut()
            } finally {
                this.user = null
                this.role = null
            }
        }
    }
})
