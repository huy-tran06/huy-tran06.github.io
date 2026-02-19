import { defineStore } from "pinia"
import { supabase } from "../lib/supabase"

export const useUnitStore = defineStore("units", {
    state: () => ({
        units: []
    }),

    actions: {
        async fetchUnits() {
            const { data, error } = await supabase
            .from("units")
            .select("*")

            if(!error) {
                this.units = data
            }
        }, 

        async createUnit(payload) {
            const { data, error } = await supabase
            .from("units")
            .insert(payload)
            .select()

            if(!error && data) {
                this.units.push(data[0])
            }

            return { data, error }
        }
    }
})