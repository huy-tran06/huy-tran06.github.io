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
    <v-card class="pa-4 mb-4" elevation="3">
        <v-card-title>Create Unit</v-card-title>

        <v-card-text>
            <v-form @submit.prevent="createUnit">
                <v-text-field
                    v-model="name"
                    label="Unit Name"
                    required
                />

                <v-textarea
                    v-model="description"
                    label="Description"
                    rows="3"
                    auto-grow
                />

                <v-btn
                    type="submit"
                    :loading="loading"
                    color="primary"
                    block
                >
                    Create Unit
                </v-btn>
            </v-form>

            <v-alert
                v-if="errorMessage"
                type="error"
                variant="tonal"
                class="mt-3"
            >
                {{ errorMessage }}
            </v-alert>

            <v-alert
                v-if="successMessage"
                type="success"
                variant="tonal"
                class="mt-3"
            >
                {{ successMessage }}
            </v-alert>
        </v-card-text>
    </v-card>
</template>
