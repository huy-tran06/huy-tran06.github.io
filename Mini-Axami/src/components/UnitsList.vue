<script setup>
import { computed, onMounted, ref, watch } from "vue"
import CreateTaskForm from './CreateTaskForm.vue';
import { useTaskStore } from "../stores/taskStore"
import { useAuthStore } from "../stores/auth"

const props = defineProps({
    units: {
        type: Array,
        default: () => []
    }
})

const taskStore = useTaskStore()
const authStore = useAuthStore()

const isCustomer = computed(() => authStore.role === "customer")
const canSubmitTask = computed(() =>
    authStore.role === "customer" || authStore.role === "worker"
)

const actionLoadingByTask = ref({})
const actionErrorByTask = ref({})

async function loadTasks() {
    await Promise.all(
        props.units.map((unit) => taskStore.fetchTasks(unit.id))
    )
}

function tasksForUnit(unitId) {
    return taskStore.tasksByUnit[unitId] || []
}

async function approveTask(taskId, unitId) {
    actionErrorByTask.value[taskId] = ""
    actionLoadingByTask.value[taskId] = true

    const { error } = await taskStore.approveSuggestedTask(taskId, unitId)

    if (error) {
        actionErrorByTask.value[taskId] = error.message || "Could not approve task."
    }

    actionLoadingByTask.value[taskId] = false
}

onMounted(loadTasks)

watch(
    () => props.units.map((unit) => unit.id).join(","),
    () => {
        loadTasks()
    }
)
</script>

<template>
    <v-container class="pa-0">
        <v-row v-if="units.length">
            <v-col
                v-for="unit in units"
                :key="unit.id"
                cols="12"
            >
                <v-card elevation="2" class="mb-4">
                    <v-card-title>{{ unit.name }}</v-card-title>

                    <v-card-text>
                        <CreateTaskForm v-if="canSubmitTask" :unitId="unit.id"/>

                        <v-divider class="my-4" />

                        <div class="text-subtitle-1 mb-2">Tasks</div>

                        <v-list v-if="tasksForUnit(unit.id).length" density="comfortable">
                            <v-list-item
                                v-for="task in tasksForUnit(unit.id)"
                                :key="task.id"
                            >
                                <v-list-item-title>{{ task.title }}</v-list-item-title>
                                <v-list-item-subtitle>
                                    Status: {{ task.status }}
                                </v-list-item-subtitle>

                                <template #append>
                                    <v-btn
                                        v-if="isCustomer && task.status === 'suggested'"
                                        @click="approveTask(task.id, unit.id)"
                                        :loading="actionLoadingByTask[task.id]"
                                        size="small"
                                        color="primary"
                                        variant="tonal"
                                    >
                                        Approve suggestion
                                    </v-btn>
                                </template>
                            </v-list-item>
                        </v-list>

                        <v-alert
                            v-else
                            type="info"
                            variant="tonal"
                        >
                            No tasks yet.
                        </v-alert>

                        <v-alert
                            v-for="task in tasksForUnit(unit.id)"
                            :key="`error-${task.id}`"
                            v-show="actionErrorByTask[task.id]"
                            type="error"
                            variant="tonal"
                            class="mt-2"
                        >
                            {{ actionErrorByTask[task.id] }}
                        </v-alert>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-alert
            v-else
            type="info"
            variant="tonal"
        >
            No units yet.
        </v-alert>
    </v-container>
</template>
