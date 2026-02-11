import { defineStore } from "pinia"
import { supabase } from "../lib/supabase"
import { watch } from "vue"

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user : null,
        role: null,
        loading: true
    }),
    actions: {
        async init() {
            const getUser = await supabase.auth.getUser()
            this.user = getUser.data.user ?? null

            watch(() => this.user, async (user) => {
                if(!user){
                    this.role = null
                    return
                }

                const result = await supabase
                    .from("users")
                    .select("role")
                    .eq("id", this.user.id)
                    .single()

                const roleData = result.data
                const error = result.error

                if(!error && roleData){
                    this.role = roleData.role
                }
                else{
                    this.role = null
                }
            },
            { immediate: true }
        )

            supabase.auth.onAuthStateChange(async (_event, session) => {
                this.user = session?.user ?? null
            })

            this.loading = false
        },

        async logout() {
            await supabase.auth.signOut()
            this.user = null
            this.role = null
        }
    }
})