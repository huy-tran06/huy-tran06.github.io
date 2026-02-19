<script setup>
import { onMounted } from "vue"
import { useUnitStore } from "../stores/unitStore";
import UnitsList from "./UnitsList.vue";

const unitStore = useUnitStore()

onMounted(() => {
    unitStore.fetchUnits()
})
</script>

<template>
    <div>
        <h2>All Units</h2>
        <UnitsList :units="unitStore.units"/>
    </div>
</template>