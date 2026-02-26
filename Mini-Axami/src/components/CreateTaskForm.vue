<script setup>
import { ref } from "vue"
import { useTaskStore } from "../stores/taskStore"

const props = defineProps({
    unitId: {
        type: String,
        required: true
    }
})

const taskStore = useTaskStore()

const title = ref("")
const description = ref("")
const price = ref(null)
const priority = ref("medium")

const loading = ref(false)
const errorMessage = ref("")
const successMessage = ref("")
const formRef = ref(null)

const titleRules = [
    v => !!v || "Title is required",
    v => (v && v.length >= 3) || "Minimum 3 characters"
]

async function createTask() {
    errorMessage.value = ""
    successMessage.value = ""

    const { valid } = await formRef.value.validate()
    if(!valid){
        return
    }

    loading.value = true

    const { error } = await taskStore.createTask({
        unit_id: props.unitId,
        title: title.value,
        description: description.value || null,
        price: price.value || null,
        priority: priority.value
    })
    if(error){
        errorMessage.value = error.message
    } else {
        successMessage.value = "Task created successfully!"

        title.value = ""
        description.value = ""
        price.value = null
        priority.value = "medium"

        formRef.value.resetValidation()
    }

    loading.value = false
}
</script>

<template>
    <v-card class="pa-4 mb-4" elevation="3">
        <v-card-title>Create New Task</v-card-title>

        <v-card-text>
            <v-form ref="formRef" @submit.prevent="createTask">
                <v-text-field
                    v-model="title"
                    label="Task Title"
                    :rules="titleRules"
                    required
                />

                <v-textarea
                    v-model="description"
                    label="Description"
                    rows="3"
                    auto-grow
                />

                <v-text-field
                    v-model="price"
                    label="Price (optional)"
                    type="number"
                    min="0"
                />

                <v-select
                    v-model="priority"
                    :items="['low', 'medium', 'high']"
                    label="Priority"
                />

                <v-btn
                    type="submit"
                    color="primary"
                    :loading="loading"
                    block
                    class="mt-3"
                >
                    Create Task
                </v-btn>
            </v-form>

            <v-alert
                v-if="successMessage"
                type="success"
                class="mt-3"
            >
                {{ successMessage }}
            </v-alert>
        </v-card-text>
    </v-card>
</template>