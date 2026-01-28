import { defineStore } from "pinia"
import { supabase } from "../lib/supabase"

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user : null
    }),
    actions: {
        async init() {
            const getUser = await supabase.auth.getUser()
            this.user = getUser.data.user

            supabase.auth.onAuthStateChange((_event, session) => {
                this.user = session?.user ?? null
            })
        }
    }
})