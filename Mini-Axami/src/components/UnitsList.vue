<script setup>
defineProps({
    units: Array
})
</script>

<template>
    <div>
        <ul v-if="units.length">
            <li v-for="unit in units" :key="unit.id">
                {{ unit.name }}
            </li>
        </ul>

        <p v-else>No units yet.</p>
    </div>
</template>