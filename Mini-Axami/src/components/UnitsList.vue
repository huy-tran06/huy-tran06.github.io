<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue"
import CreateTaskForm from './CreateTaskForm.vue';
import { useTaskStore } from "../stores/taskStore"
import { useAuthStore } from "../stores/auth"
import { useUserStore } from "../stores/userStore"

const props = defineProps({
    units: {
        type: Array,
        default: () => []
    },
    collapseTasksByDefault: {
        type: Boolean,
        default: false
    }
})

const taskStore = useTaskStore()
const authStore = useAuthStore()
const userStore = useUserStore()

const isCustomer = computed(() => authStore.role === "customer")
const isWorker = computed(() => authStore.role === "worker")
const canSubmitTask = computed(() =>
    authStore.role === "customer" || authStore.role === "worker"
)

const actionLoadingByTask = ref({})
const actionErrorByTask = ref({})
const dialogByUnit = reactive({})
const tasksVisibleByUnit = reactive({})
const editDialogByTask = reactive({})
const editLoadingByTask = reactive({})
const editErrorByTask = reactive({})
const editSuccessByTask = reactive({})
const editFormByTask = reactive({})
const taskDetailsDialogByUnit = reactive({})
const deleteDialogByUnit = reactive({})
const deleteErrorByUnit = reactive({})
const selectedTaskByUnit = reactive({})

const submitButtonText = computed(() =>
    authStore.role === "worker" ? "Suggest Task" : "Create Task"
)
const workerNoDataText = computed(() => {
    if (userStore.workersLoading) {
        return "Loading workers..."
    }

    if (userStore.workersError) {
        return userStore.workersError
    }

    return "No workers available."
})

async function loadTasks() {
    const results = await Promise.all(
        props.units.map((unit) => taskStore.fetchTasks(unit.id))
    )

    const userIds = results
        .flatMap((result) => result.data || [])
        .flatMap((task) => [task.created_by, task.suggested_by, task.assigned_worker_id])
        .filter(Boolean)

    if (userIds.length) {
        await userStore.fetchUsersByIds(userIds)
    }
}

function tasksForUnit(unitId) {
    const tasks = taskStore.tasksByUnit[unitId] || []
    const priorityRank = {
        high: 0,
        medium: 1,
        low: 2
    }

    return tasks
        .map((task, index) => ({ task, index }))
        .sort((a, b) => {
            const aRank = priorityRank[a.task.priority] ?? 99
            const bRank = priorityRank[b.task.priority] ?? 99

            if (aRank !== bRank) {
                return aRank - bRank
            }

            return a.index - b.index
        })
        .map((entry) => entry.task)
}

function areTasksVisible(unitId) {
    return !props.collapseTasksByDefault || !!tasksVisibleByUnit[unitId]
}

function toggleTasks(unitId) {
    tasksVisibleByUnit[unitId] = !tasksVisibleByUnit[unitId]
}

function formatStatusLabel(status) {
    if (!status) return ""
    return status.replaceAll("_", " ")
}

function taskPriorityClass(priority) {
    if (priority === "high") return "task-priority-high"
    if (priority === "medium") return "task-priority-medium"
    if (priority === "low") return "task-priority-low"
    return "task-priority-default"
}

function formatPriorityLabel(priority) {
    return priority || "Not set"
}

function formatPrice(price) {
    if (price === null || price === undefined || price === "") {
        return "Not set"
    }

    return `${price} SEK`
}

function getUserName(userId, fallback = "Not set") {
    if (!userId) {
        return fallback
    }

    return userStore.getUserDisplayName(userId)
}

async function approveTask(taskId, unitId) {
    actionErrorByTask.value[taskId] = ""
    actionLoadingByTask.value[taskId] = true

    try {
        const { error } = await taskStore.approveSuggestedTask(taskId, unitId)

        if (error) {
            actionErrorByTask.value[taskId] = error.message || "Could not approve task."
        }
    } catch (error) {
        actionErrorByTask.value[taskId] = error?.message || "Could not approve task."
    } finally {
        actionLoadingByTask.value[taskId] = false
    }
}

function openDeleteDialog(task, unitId) {
    selectedTaskByUnit[unitId] = task
    deleteErrorByUnit[unitId] = ""
    closeTaskDetails(unitId)
    deleteDialogByUnit[unitId] = true
}

function closeDeleteDialog(unitId) {
    deleteDialogByUnit[unitId] = false
    deleteErrorByUnit[unitId] = ""
}

async function deleteTask(unitId) {
    const task = currentTaskForUnit(unitId)

    if (!task) {
        closeDeleteDialog(unitId)
        return
    }

    actionErrorByTask.value[task.id] = ""
    actionLoadingByTask.value[task.id] = true

    try {
        const { error } = await taskStore.deleteTask(task.id, unitId)

        if (error) {
            actionErrorByTask.value[task.id] = error.message || "Could not delete task."
            deleteErrorByUnit[unitId] = actionErrorByTask.value[task.id]
        } else {
            if (selectedTaskByUnit[unitId]?.id === task.id) {
                selectedTaskByUnit[unitId] = null
            }

            closeDeleteDialog(unitId)
        }
    } catch (error) {
        actionErrorByTask.value[task.id] = error?.message || "Could not delete task."
        deleteErrorByUnit[unitId] = actionErrorByTask.value[task.id]
    } finally {
        actionLoadingByTask.value[task.id] = false
    }
}

function openCreateTaskDialog(unitId) {
    dialogByUnit[unitId] = true
}

function closeCreateTaskDialog(unitId) {
    dialogByUnit[unitId] = false
}

function openTaskDetails(task, unitId) {
    selectedTaskByUnit[unitId] = task
    taskDetailsDialogByUnit[unitId] = true
}

function closeTaskDetails(unitId) {
    taskDetailsDialogByUnit[unitId] = false
}

function currentTaskForUnit(unitId) {
    const selectedTask = selectedTaskByUnit[unitId]

    if (!selectedTask) {
        return null
    }

    const tasks = taskStore.tasksByUnit[unitId] || []
    return tasks.find((task) => task.id === selectedTask.id) || selectedTask
}

function canWorkerEditTask(task) {
    return isWorker.value && ["suggested", "created", "in_progress"].includes(task.status)
}

function canWorkerEditSuggestedTaskDetails(task) {
    return isWorker.value && task.suggested_by === authStore.user?.id
}

function canCustomerEditTask(task) {
    return isCustomer.value && task.status !== "suggested"
}

function canEditTask(task) {
    return canWorkerEditTask(task) || canCustomerEditTask(task)
}

function canApproveTask(task) {
    return isCustomer.value && task.status === "suggested"
}

function canDeleteTask(task) {
    return canCustomerEditTask(task)
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

function customerStatusOptions() {
    return [
        { title: "Created", value: "created" },
        { title: "In progress", value: "in_progress" },
        { title: "Completed", value: "completed" }
    ]
}

async function loadWorkersIfCustomer(force = false) {
    if (!isCustomer.value) {
        return
    }

    if (!force && (userStore.workersLoading || userStore.workers.length)) {
        return
    }

    await userStore.fetchWorkers()
}

function openEditDialog(task, unitId = null) {
    if (unitId !== null) {
        closeTaskDetails(unitId)
    }

    editFormByTask[task.id] = {
        title: task.title || "",
        description: task.description || "",
        price: task.price,
        assigned_worker_id: task.assigned_worker_id || null,
        priority: task.priority || "medium",
        comments: task.comments || "",
        status: isCustomer.value ? (task.status || "") : ""
    }
    editErrorByTask[task.id] = ""
    editSuccessByTask[task.id] = ""
    editDialogByTask[task.id] = true

    if (isCustomer.value && !userStore.workers.length) {
        loadWorkersIfCustomer(true)
    }
}

function closeEditDialog(taskId) {
    editDialogByTask[taskId] = false
}

async function saveTaskEdit(task, unitId) {
    const form = editFormByTask[task.id] || { comments: "", status: "" }

    const updates = {}

    if (isCustomer.value) {
        updates.title = form.title
        updates.description = form.description || null
        updates.price = form.price === "" ? null : form.price
        updates.assigned_worker_id = form.assigned_worker_id || null
        updates.priority = form.priority
        updates.status = form.status
        updates.comments = form.comments || null
    } else {
        if (canWorkerEditSuggestedTaskDetails(task)) {
            updates.title = form.title
            updates.description = form.description || null
        }

        updates.comments = form.comments || null

        if (form.status) {
            updates.status = form.status
        }
    }

    editLoadingByTask[task.id] = true
    editErrorByTask[task.id] = ""
    editSuccessByTask[task.id] = ""

    try {
        const { data, error } = await taskStore.updateTask(task.id, unitId, updates)

        if (error) {
            editErrorByTask[task.id] = error.message || "Could not update task."
        } else {
            if (selectedTaskByUnit[unitId]?.id === task.id) {
                selectedTaskByUnit[unitId] = data
            }
            editSuccessByTask[task.id] = "Task updated."
        }
    } catch (error) {
        editErrorByTask[task.id] = error?.message || "Could not update task."
    } finally {
        editLoadingByTask[task.id] = false
    }
}

onMounted(async () => {
    await loadTasks()
    await loadWorkersIfCustomer()
})

watch(
    () => props.units.map((unit) => unit.id).join(","),
    () => {
        loadTasks()
    }
)

watch(
    () => authStore.role,
    () => {
        loadWorkersIfCustomer(true)
    }
)

watch(
    () =>
        props.units.flatMap((unit) =>
            tasksForUnit(unit.id).flatMap((task) => [
                task.created_by,
                task.suggested_by,
                task.assigned_worker_id
            ])
        ),
    (ids) => {
        if (ids.length) {
            userStore.fetchUsersByIds(ids)
        }
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
                            size="small"
                            variant="outlined"
                            color="primary"
                            class="mb-3"
                            @click="toggleTasks(unit.id)"
                        >
                            {{ areTasksVisible(unit.id) ? "Hide Tasks" : "Show Tasks" }}
                        </v-btn>

                        <v-divider class="my-4" />

                        <template v-if="areTasksVisible(unit.id)">
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

                            <div class="text-subtitle-1 mb-2">Tasks</div>

                            <v-list v-if="tasksForUnit(unit.id).length" density="comfortable">
                                <v-list-item
                                    v-for="task in tasksForUnit(unit.id)"
                                    :key="task.id"
                                    link
                                    class="mb-2 rounded-lg task-list-item"
                                    :class="taskPriorityClass(task.priority)"
                                    @click="openTaskDetails(task, unit.id)"
                                >
                                    <v-list-item-title>{{ task.title }}</v-list-item-title>
                                    <div class="mt-1">
                                        <v-list-item-subtitle class="mb-1">
                                            Price: {{ formatPrice(task.price) }}
                                        </v-list-item-subtitle>
                                        <v-list-item-subtitle class="mb-1">
                                            Status: {{ formatStatusLabel(task.status) }}
                                        </v-list-item-subtitle>
                                    </div>

                                    <template #append>
                                    </template>
                                    <v-dialog
                                        v-if="canEditTask(task)"
                                        v-model="editDialogByTask[task.id]"
                                        max-width="640"
                                    >
                                        <v-card>
                                            <div class="d-flex align-start justify-space-between pr-2">
                                                <v-card-title>Edit Task</v-card-title>
                                                <v-btn
                                                    icon="fa:fas fa-xmark"
                                                    variant="text"
                                                    density="comfortable"
                                                    class="task-dialog-close-btn mt-2"
                                                    aria-label="Close edit task dialog"
                                                    @click="closeEditDialog(task.id)"
                                                />
                                            </div>
                                            <v-card-text>
                                                <template v-if="isCustomer">
                                                    <v-text-field
                                                        v-model="editFormByTask[task.id].title"
                                                        label="Title"
                                                    />

                                                    <v-textarea
                                                        v-model="editFormByTask[task.id].description"
                                                        label="Description"
                                                        rows="3"
                                                        auto-grow
                                                    />

                                                    <v-text-field
                                                        v-model="editFormByTask[task.id].price"
                                                        label="Price"
                                                        type="number"
                                                        min="0"
                                                    />

                                                    <v-select
                                                        v-model="editFormByTask[task.id].assigned_worker_id"
                                                        :items="userStore.workers"
                                                        item-title="full_name"
                                                        item-value="id"
                                                        label="Assigned worker"
                                                        :loading="userStore.workersLoading"
                                                        :no-data-text="workerNoDataText"
                                                        clearable
                                                    />

                                                    <v-select
                                                        v-model="editFormByTask[task.id].priority"
                                                        :items="['low', 'medium', 'high']"
                                                        label="Priority"
                                                    />

                                                    <v-select
                                                        v-model="editFormByTask[task.id].status"
                                                        :items="customerStatusOptions()"
                                                        item-title="title"
                                                        item-value="value"
                                                        label="Status"
                                                    />
                                                </template>

                                                <template v-if="canWorkerEditSuggestedTaskDetails(task)">
                                                    <v-text-field
                                                        v-model="editFormByTask[task.id].title"
                                                        label="Title"
                                                    />

                                                    <v-textarea
                                                        v-model="editFormByTask[task.id].description"
                                                        label="Description"
                                                        rows="3"
                                                        auto-grow
                                                    />
                                                </template>

                                                <v-textarea
                                                    v-model="editFormByTask[task.id].comments"
                                                    label="Comments"
                                                    rows="3"
                                                    auto-grow
                                                />

                                                <v-select
                                                    v-if="isWorker && statusOptionsForTask(task).length"
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
                                                    color="success"
                                                    variant="flat"
                                                    class="task-save-btn"
                                                    :loading="editLoadingByTask[task.id]"
                                                    block
                                                    @click.stop="saveTaskEdit(task, unit.id)"
                                                >
                                                    Save
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                </v-list-item>
                            </v-list>

                            <v-dialog
                                v-model="taskDetailsDialogByUnit[unit.id]"
                                max-width="760"
                            >
                                <v-card v-if="currentTaskForUnit(unit.id)">
                                    <div class="d-flex align-start justify-space-between pr-2">
                                        <v-card-title>{{ currentTaskForUnit(unit.id).title }}</v-card-title>
                                        <v-btn
                                            icon="fa:fas fa-xmark"
                                            variant="text"
                                            density="comfortable"
                                            class="task-dialog-close-btn mt-2"
                                            aria-label="Close task details"
                                            @click="closeTaskDetails(unit.id)"
                                        />
                                    </div>
                                    <v-card-text>
                                        <div class="mb-2">
                                            <strong>Description:</strong>
                                            {{ currentTaskForUnit(unit.id).description || "No description." }}
                                        </div>
                                        <div class="mb-2">
                                            <strong>Price:</strong>
                                            {{ formatPrice(currentTaskForUnit(unit.id).price) }}
                                        </div>
                                        <div class="mb-2">
                                            <strong>Assigned worker:</strong>
                                            {{ getUserName(currentTaskForUnit(unit.id).assigned_worker_id, "Unassigned") }}
                                        </div>
                                        <div class="mb-2">
                                            <strong>Priority:</strong>
                                            {{ formatPriorityLabel(currentTaskForUnit(unit.id).priority) }}
                                        </div>
                                        <div class="mb-2">
                                            <strong>Status:</strong>
                                            {{ formatStatusLabel(currentTaskForUnit(unit.id).status) || "Not set" }}
                                        </div>
                                        <div class="mb-2">
                                            <strong>Created by:</strong>
                                            {{ getUserName(currentTaskForUnit(unit.id).created_by) }}
                                        </div>
                                        <div class="mb-2">
                                            <strong>Suggested by:</strong>
                                            {{ getUserName(currentTaskForUnit(unit.id).suggested_by) }}
                                        </div>
                                        <div class="mb-2">
                                            <strong>Comments:</strong>
                                            {{ currentTaskForUnit(unit.id).comments || "No comments." }}
                                        </div>
                                    </v-card-text>
                                    <v-card-actions class="px-6 pb-6 task-dialog-actions">
                                        <v-btn
                                            v-if="canApproveTask(currentTaskForUnit(unit.id))"
                                            @click="approveTask(currentTaskForUnit(unit.id).id, unit.id)"
                                            :loading="actionLoadingByTask[currentTaskForUnit(unit.id).id]"
                                            color="primary"
                                            variant="tonal"
                                            block
                                            class="task-dialog-action-full"
                                        >
                                            Approve suggestion
                                        </v-btn>
                                        <div
                                            v-if="canEditTask(currentTaskForUnit(unit.id)) || canDeleteTask(currentTaskForUnit(unit.id))"
                                            class="task-dialog-action-row"
                                        >
                                            <v-btn
                                                v-if="canEditTask(currentTaskForUnit(unit.id))"
                                                color="secondary"
                                                variant="tonal"
                                                class="task-dialog-action-half"
                                                @click="openEditDialog(currentTaskForUnit(unit.id), unit.id)"
                                            >
                                                Edit
                                            </v-btn>
                                            <v-btn
                                                v-if="canDeleteTask(currentTaskForUnit(unit.id))"
                                                color="error"
                                                variant="flat"
                                                class="task-delete-btn task-dialog-action-half"
                                                :loading="actionLoadingByTask[currentTaskForUnit(unit.id).id]"
                                                @click="openDeleteDialog(currentTaskForUnit(unit.id), unit.id)"
                                            >
                                                Delete Task
                                            </v-btn>
                                        </div>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>

                            <v-dialog
                                v-model="deleteDialogByUnit[unit.id]"
                                max-width="520"
                            >
                                <v-card v-if="currentTaskForUnit(unit.id)">
                                    <div class="d-flex align-start justify-space-between pr-2">
                                        <v-card-title>Delete Task</v-card-title>
                                        <v-btn
                                            icon="fa:fas fa-xmark"
                                            variant="text"
                                            density="comfortable"
                                            class="task-dialog-close-btn mt-2"
                                            aria-label="Close delete task dialog"
                                            @click="closeDeleteDialog(unit.id)"
                                        />
                                    </div>
                                    <v-card-text>
                                        Are you sure you want to delete
                                        <strong>{{ currentTaskForUnit(unit.id).title }}</strong
                                        >?

                                        <v-alert
                                            v-if="deleteErrorByUnit[unit.id]"
                                            type="error"
                                            variant="tonal"
                                            class="mt-4"
                                        >
                                            {{ deleteErrorByUnit[unit.id] }}
                                        </v-alert>
                                    </v-card-text>
                                    <v-card-actions class="px-6 pb-6">
                                        <div class="task-dialog-action-row">
                                            <v-btn
                                                color="error"
                                                variant="flat"
                                                class="task-delete-btn task-dialog-action-half"
                                                :loading="actionLoadingByTask[currentTaskForUnit(unit.id).id]"
                                                @click="deleteTask(unit.id)"
                                            >
                                                Delete Task
                                            </v-btn>
                                            <v-btn
                                                variant="tonal"
                                                class="task-dialog-action-half"
                                                @click="closeDeleteDialog(unit.id)"
                                            >
                                                Cancel
                                            </v-btn>
                                        </div>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>

                            <v-alert
                                v-if="!tasksForUnit(unit.id).length"
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
                        </template>
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

<style scoped>
.task-list-item {
    border-width: 2px;
    border-style: solid;
}

.task-priority-high {
    border-color: #d32f2f;
}

.task-priority-medium {
    border-color: #fbc02d;
}

.task-priority-low {
    border-color: #388e3c;
}

.task-priority-default {
    border-color: #bdbdbd;
}

.task-dialog-close-btn {
    align-self: flex-start;
}

.task-dialog-actions {
    flex-direction: column;
    gap: 12px;
}

.task-dialog-action-row {
    display: flex;
    width: 100%;
    gap: 12px;
}

.task-dialog-action-full,
.task-dialog-action-half {
    min-width: 0;
}

.task-dialog-action-half {
    flex: 1 1 0;
}

.task-delete-btn {
    background-color: #c62828 !important;
    color: #fff !important;
}

.task-save-btn {
    background-color: #2e7d32 !important;
    color: #fff !important;
}
</style>
