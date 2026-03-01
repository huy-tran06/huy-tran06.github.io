<script setup>
import { onMounted, ref } from "vue"
import { useUnitStore } from "../stores/unitStore";
import CreateUnitForm from "./CreateUnitForm.vue";
import UnitsList from "./UnitsList.vue";

const unitStore = useUnitStore()
const createUnitDialogOpen = ref(false)

onMounted(() => {
    unitStore.fetchUnits()
})

function onUnitCreated() {
    createUnitDialogOpen.value = false
}
</script>

<template>
    <v-container>
        <v-btn
            color="primary"
            class="mb-4"
            @click="createUnitDialogOpen = true"
        >
            Add New Unit
        </v-btn>

        <v-dialog v-model="createUnitDialogOpen" max-width="700">
            <CreateUnitForm @created="onUnitCreated" />
        </v-dialog>

        <v-card elevation="2">
            <v-card-title>Your Units</v-card-title>
            <v-card-text>
                <UnitsList :units="unitStore.units" :collapseTasksByDefault="true" />
            </v-card-text>
        </v-card>
    </v-container>
</template>
