<script setup>
import { useUnitStore } from "../stores/unitStore";
import { ref } from "vue";

const unitStore = useUnitStore()

const name = ref("")
const description = ref("")
const loading = ref(false)
const errorMessage = ref("")
const successMessage = ref("")

async function createUnit() {
    loading.value = true
    errorMessage.value = ""
    successMessage.value = ""

    const { error } = await unitStore.createUnit({
        name: name.value,
        description: description.value
    })

    if(error) {
        errorMessage.value = error.message
    }
    else {
        successMessage.value = "Unit created successfully!"
        name.value = ""
        description.value = ""
    }

    loading.value = false
}
</script>

<template>
    <form @submit.prevent="createUnit">
        <div>
            <label>Unit Name</label>
            <input v-model="name" required/>
        </div>

        <div>
            <label>Description</label>
            <textarea v-model="description"></textarea>
        </div>

        <button type="submit" :disabled="loading">
            {{ loading ? "Creating..." : "Create Unit"}}
        </button>
    </form>

    <p v-if="errorMessage" style="color:red">
        {{ errorMessage }}
    </p>

    <p v-if="successMessage" style="color:green">
        {{ successMessage }}
    </p>
</template>