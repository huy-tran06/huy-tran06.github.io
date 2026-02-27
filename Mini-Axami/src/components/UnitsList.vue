<script setup>
import CreateTaskForm from './CreateTaskForm.vue';

defineProps({
    units: {
        type: Array,
        default: () => []
    }
})
</script>

<template>
    <!-- <v-container>
        <v-card elevation="2" class="pa-4">
            <v-card-title class="text-h6">
                Units
            </v-card-title>

            <v-divider class="mb-4"/>
                
            
        </v-card>
    </v-container> -->

    <div>
        <ul v-if="units.length">
            <li v-for="unit in units" :key="unit.id">
                {{ unit.name }}
                <CreateTaskForm :unitId="unit.id"/>
            </li>
        </ul>

        <p v-else>No units yet.</p>
    </div>
</template>