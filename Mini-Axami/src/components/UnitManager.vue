<script setup>
import { onMounted } from "vue"
import { useUnitStore } from "../stores/unitStore";
import CreateUnitForm from "./CreateUnitForm.vue";
import UnitsList from "./UnitsList.vue";

const unitStore = useUnitStore()

onMounted(() => {
    unitStore.fetchUnits()
})
</script>

<template>
    <div>
        <CreateUnitForm/>

        <h2>Your Units</h2>
        <UnitsList :units="unitStore.units"/>
    </div>
</template>