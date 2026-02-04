import { defineStore } from "pinia"
import { supabase } from "../lib/supabase"

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

            if(this.user){
                const result = await supabase
                    .from("users")
                    .select("role")
                    .eq("id", this.user.id)
                    .single()

                const roleData = result.data
                const error = result.error

                if(!error){
                    this.role = roleData.role
                }
            }

            supabase.auth.onAuthStateChange(async (_event, session) => {
                this.user = session?.user ?? null

                const result = await supabase
                    .from("users")
                    .select("role")
                    .eq("id", this.user.id)
                    .single()

                const roleData = result.data
                const error = result.error

                if(!error){
                    this.role = roleData.role
                }
                else {
                    this.role = null
                }
            })

            this.loading = false
        }
    }
})