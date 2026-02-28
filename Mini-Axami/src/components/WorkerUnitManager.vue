<script setup>
import { onMounted } from "vue"
import { useUnitStore } from "../stores/unitStore"
import UnitsList from "./UnitsList.vue"

const unitStore = useUnitStore()

onMounted(() => {
    unitStore.fetchUnits()
})
</script>

<template>
    <v-container>
        <v-card elevation="2">
            <v-card-title>Your Related Units</v-card-title>
            <v-card-text>
                <UnitsList :units="unitStore.units" />
            </v-card-text>
        </v-card>
    </v-container>
</template>
