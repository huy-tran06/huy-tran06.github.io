import { acceptHMRUpdate, defineStore } from "pinia"
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
                    .order("created_at", { ascending: true })

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
        },

        async updateUnit(unitId, updates) {
            try {
                const { data, error } = await supabase
                    .from("units")
                    .update(updates)
                    .eq("id", unitId)
                    .select()
                    .maybeSingle()

                if (!error && data) {
                    this.units = this.units.map((unit) =>
                        unit.id === unitId ? data : unit
                    )
                }

                if (!error && !data) {
                    return {
                        data: null,
                        error: {
                            message: "Unit was not updated. You may not have permission for this unit."
                        }
                    }
                }

                return { data, error }
            } catch (error) {
                return {
                    data: null,
                    error: { message: error?.message || "Could not update unit." }
                }
            }
        },

        async deleteUnit(unitId) {
            try {
                const { data, error } = await supabase
                    .from("units")
                    .delete()
                    .eq("id", unitId)
                    .select()
                    .maybeSingle()

                if (!error && data) {
                    this.units = this.units.filter((unit) => unit.id !== unitId)
                    return { data, error: null }
                }

                if (!error && !data) {
                    return {
                        data: null,
                        error: {
                            message: "Unit was not deleted. It may not be empty or you may not have permission for this unit."
                        }
                    }
                }

                return { data, error }
            } catch (error) {
                return {
                    data: null,
                    error: { message: error?.message || "Could not delete unit." }
                }
            }
        }
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUnitStore, import.meta.hot))
}
