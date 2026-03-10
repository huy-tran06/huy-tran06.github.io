import { defineStore } from "pinia"
import { supabase } from "../lib/supabase"

export const useUnitStore = defineStore("units", {
    state: () => ({
        units: []
    }),

    actions: {
        async fetchUnits() {
            try {
                const { data, error } = await supabase
                    .from("units")
                    .select("*")

                if (!error) {
                    this.units = data
                }

                return { data, error }
            } catch (error) {
                return {
                    data: null,
                    error: { message: error?.message || "Could not load units." }
                }
            }
        }, 

        async createUnit(payload) {
            try {
                const { data, error } = await supabase
                    .from("units")
                    .insert(payload)
                    .select()

                if (!error && data) {
                    this.units.push(data[0])
                }

                return { data, error }
            } catch (error) {
                return {
                    data: null,
                    error: { message: error?.message || "Could not create unit." }
                }
            }
        }
    }
})
