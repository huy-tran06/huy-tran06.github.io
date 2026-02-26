<script setup>
import CreateTaskForm from './CreateTaskForm.vue';

defineProps({
    units: Array
})
</script>

<template>
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