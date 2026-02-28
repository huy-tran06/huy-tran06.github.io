<script setup>
import WorkerUnitManager from "../components/WorkerUnitManager.vue"
</script>

<template>
    <v-container>
        <v-card class="mb-4" elevation="2">
            <v-card-title>Worker Dashboard</v-card-title>
            <v-card-text>
                You can view your assigned/suggested tasks and suggest new tasks in related units.
            </v-card-text>
        </v-card>
    </v-container>

    <WorkerUnitManager />
</template>
