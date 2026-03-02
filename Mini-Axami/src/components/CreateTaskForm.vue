<script setup>
import { ref, onMounted, computed, watch } from "vue"
import { useTaskStore } from "../stores/taskStore"
import { useUserStore } from "../stores/userStore"
import { useAuthStore } from "../stores/auth"

const props = defineProps({
    unitId: {
        type: String,
        required: true
    }
})
const emit = defineEmits(["submitted"])

const taskStore = useTaskStore()
const userStore = useUserStore()
const authStore = useAuthStore()

const isWorker = computed(() => authStore.role === "worker")
const formTitle = computed(() => isWorker.value ? "Suggest New Task" : "Create New Task")
const submitText = computed(() => isWorker.value ? "Send Suggestion" : "Create Task")
const workerSelectMenuOpen = ref(false)
const workerNoDataText = computed(() => {
    if (userStore.workersLoading) {
        return "Loading workers..."
    }

    if (userStore.workersError) {
        return userStore.workersError
    }

    return "No workers available. Add a user with role 'worker'."
})

async function loadWorkersIfNeeded(force = false) {
    if (isWorker.value) {
        return
    }

    if (!force && (userStore.workersLoading || userStore.workers.length)) {
        return
    }

    await userStore.fetchWorkers()
}

onMounted(() => {
    loadWorkersIfNeeded()
})

watch(
    () => authStore.role,
    (role) => {
        if (role && role !== "worker") {
            loadWorkersIfNeeded(true)
        }
    }
)

watch(
    () => workerSelectMenuOpen.value,
    (isOpen) => {
        if (isOpen && !userStore.workers.length) {
            loadWorkersIfNeeded(true)
        }
    }
)

const title = ref("")
const description = ref("")
const price = ref(null)
const priority = ref("medium")
const assignedWorkerId = ref(null)

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
        priority: priority.value,
        assigned_worker_id: isWorker.value ? null : (assignedWorkerId.value || null)
    })
    if(error){
        errorMessage.value = error.message
    } else {
        successMessage.value = isWorker.value
            ? "Task suggestion submitted!"
            : "Task created successfully!"

        title.value = ""
        description.value = ""
        price.value = null
        priority.value = "medium"
        assignedWorkerId.value = null

        formRef.value.resetValidation()
        emit("submitted")
    }

    loading.value = false
}
</script>

<template>
    <v-card class="pa-4 mb-4" elevation="3">
        <v-card-title>{{ formTitle }}</v-card-title>

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

                <v-select
                    v-if="!isWorker"
                    v-model="assignedWorkerId"
                    v-model:menu="workerSelectMenuOpen"
                    :items="userStore.workers"
                    item-title="full_name"
                    item-value="id"
                    label="Assign Worker (optional)"
                    :loading="userStore.workersLoading"
                    :no-data-text="workerNoDataText"
                    clearable
                />

                <v-btn
                    type="submit"
                    color="primary"
                    :loading="loading"
                    block
                    class="mt-3"
                >
                    {{ submitText }}
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
