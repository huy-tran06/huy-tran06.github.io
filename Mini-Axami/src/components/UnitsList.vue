<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue"
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
const isWorker = computed(() => authStore.role === "worker")
const canSubmitTask = computed(() =>
    authStore.role === "customer" || authStore.role === "worker"
)

const actionLoadingByTask = ref({})
const actionErrorByTask = ref({})
const dialogByUnit = reactive({})
const editDialogByTask = reactive({})
const editLoadingByTask = reactive({})
const editErrorByTask = reactive({})
const editSuccessByTask = reactive({})
const editFormByTask = reactive({})

const submitButtonText = computed(() =>
    authStore.role === "worker" ? "Suggest Task" : "Create Task"
)

async function loadTasks() {
    await Promise.all(
        props.units.map((unit) => taskStore.fetchTasks(unit.id))
    )
}

function tasksForUnit(unitId) {
    return taskStore.tasksByUnit[unitId] || []
}

function formatStatusLabel(status) {
    if (!status) return ""
    return status.replaceAll("_", " ")
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

function openCreateTaskDialog(unitId) {
    dialogByUnit[unitId] = true
}

function closeCreateTaskDialog(unitId) {
    dialogByUnit[unitId] = false
}

function canWorkerEditTask(task) {
    return isWorker.value && ["suggested", "created", "in_progress"].includes(task.status)
}

function statusOptionsForTask(task) {
    if (task.status === "created") {
        return [
            { title: "In progress", value: "in_progress" },
            { title: "Completed", value: "completed" }
        ]
    }

    if (task.status === "in_progress") {
        return [{ title: "Completed", value: "completed" }]
    }

    return []
}

function openEditDialog(task) {
    editFormByTask[task.id] = {
        comments: task.comments || "",
        status: ""
    }
    editErrorByTask[task.id] = ""
    editSuccessByTask[task.id] = ""
    editDialogByTask[task.id] = true
}

function closeEditDialog(taskId) {
    editDialogByTask[taskId] = false
}

async function saveWorkerTaskEdit(task, unitId) {
    const form = editFormByTask[task.id] || { comments: "", status: "" }

    const updates = {
        comments: form.comments || null
    }

    if (form.status) {
        updates.status = form.status
    }

    editLoadingByTask[task.id] = true
    editErrorByTask[task.id] = ""
    editSuccessByTask[task.id] = ""

    const { error } = await taskStore.updateTask(task.id, unitId, updates)

    if (error) {
        editErrorByTask[task.id] = error.message || "Could not update task."
    } else {
        editSuccessByTask[task.id] = "Task updated."
    }

    editLoadingByTask[task.id] = false
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
                        <v-btn
                            v-if="canSubmitTask"
                            class="mb-3"
                            color="primary"
                            variant="outlined"
                            size="small"
                            @click="openCreateTaskDialog(unit.id)"
                        >
                            {{ submitButtonText }}
                        </v-btn>

                        <v-dialog
                            v-if="canSubmitTask"
                            v-model="dialogByUnit[unit.id]"
                            max-width="760"
                        >
                            <CreateTaskForm
                                :unitId="unit.id"
                                @submitted="closeCreateTaskDialog(unit.id)"
                            />
                        </v-dialog>

                        <v-divider class="my-4" />

                        <div class="text-subtitle-1 mb-2">Tasks</div>

                        <v-list v-if="tasksForUnit(unit.id).length" density="comfortable">
                            <v-list-item
                                v-for="task in tasksForUnit(unit.id)"
                                :key="task.id"
                            >
                                <v-list-item-title>{{ task.title }}</v-list-item-title>
                                <div class="mt-1">
                                    <v-list-item-subtitle class="mb-1">
                                        Status: {{ formatStatusLabel(task.status) }}
                                    </v-list-item-subtitle>
                                    <v-list-item-subtitle>
                                        Comments: {{ task.comments || "None" }}
                                    </v-list-item-subtitle>
                                </div>

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

                                    <v-btn
                                        v-if="canWorkerEditTask(task)"
                                        @click="openEditDialog(task)"
                                        size="small"
                                        color="secondary"
                                        variant="tonal"
                                        class="ml-2"
                                    >
                                        Edit
                                    </v-btn>
                                </template>
                                <v-dialog
                                    v-if="canWorkerEditTask(task)"
                                    v-model="editDialogByTask[task.id]"
                                    max-width="640"
                                >
                                    <v-card>
                                        <v-card-title>Edit Task</v-card-title>
                                        <v-card-text>
                                            <v-textarea
                                                v-model="editFormByTask[task.id].comments"
                                                label="Comments"
                                                rows="3"
                                                auto-grow
                                            />

                                            <v-select
                                                v-if="statusOptionsForTask(task).length"
                                                v-model="editFormByTask[task.id].status"
                                                :items="statusOptionsForTask(task)"
                                                item-title="title"
                                                item-value="value"
                                                label="New status"
                                                clearable
                                            />

                                            <v-alert
                                                v-if="editSuccessByTask[task.id]"
                                                type="success"
                                                variant="tonal"
                                                class="mt-2"
                                            >
                                                {{ editSuccessByTask[task.id] }}
                                            </v-alert>

                                            <v-alert
                                                v-if="editErrorByTask[task.id]"
                                                type="error"
                                                variant="tonal"
                                                class="mt-2"
                                            >
                                                {{ editErrorByTask[task.id] }}
                                            </v-alert>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer />
                                            <v-btn
                                                variant="text"
                                                @click="closeEditDialog(task.id)"
                                            >
                                                Close
                                            </v-btn>
                                            <v-btn
                                                color="primary"
                                                :loading="editLoadingByTask[task.id]"
                                                @click="saveWorkerTaskEdit(task, unit.id)"
                                            >
                                                Save
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
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
