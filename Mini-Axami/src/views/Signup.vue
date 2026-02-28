<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { supabase } from "../lib/supabase"
import { useAuthStore } from "../stores/auth"

const router = useRouter()
const authStore = useAuthStore()

const fullName = ref("")
const email = ref("")
const otp = ref("")
const otpSent = ref(false)
const errorMessage = ref("")
const successMessage = ref("")
const loading = ref(false)

async function sendSignupOtp() {
    errorMessage.value = ""
    successMessage.value = ""

    if (!fullName.value.trim()) {
        errorMessage.value = "Full name is required."
        return
    }

    loading.value = true

    const { error } = await supabase.auth.signInWithOtp({
        email: email.value,
        options: {
            shouldCreateUser: true,
            data: {
                full_name: fullName.value.trim()
            }
        }
    })

    loading.value = false

    if (error) {
        errorMessage.value = error.message
        return
    }

    otpSent.value = true
    successMessage.value = "OTP sent. Check your email."
}

async function verifySignupOtp() {
    errorMessage.value = ""
    successMessage.value = ""
    loading.value = true

    const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.value,
        token: otp.value,
        type: "email"
    })

    if (verifyError) {
        loading.value = false
        errorMessage.value = verifyError.message
        return
    }

    const userId = verifyData.user?.id
    if (!userId) {
        loading.value = false
        errorMessage.value = "Could not get user after OTP verification."
        return
    }

    const { error: profileError } = await supabase
        .from("users")
        .upsert({
            id: userId,
            full_name: fullName.value.trim(),
            role: "customer"
        })

    if (profileError) {
        loading.value = false
        errorMessage.value = `Signed in, but failed to save profile: ${profileError.message}`
        return
    }

    authStore.user = verifyData.user
    await authStore.fetchRoles()

    loading.value = false
    router.replace("/dashboard")
}
</script>

<template>
    <v-container class="fill-height d-flex align-center justify-center">
        <v-card width="420" elevation="3">
            <v-card-title>Sign up with OTP</v-card-title>
            <v-card-text>
                <div v-if="!otpSent">
                    <v-text-field
                        v-model="fullName"
                        label="Full name"
                        required
                    />

                    <v-text-field
                        v-model="email"
                        label="Email"
                        type="email"
                        required
                    />

                    <v-btn
                        @click="sendSignupOtp"
                        color="primary"
                        block
                        :loading="loading"
                    >
                        Send OTP
                    </v-btn>
                </div>

                <div v-else>
                    <v-text-field
                        v-model="otp"
                        label="Enter OTP code"
                    />

                    <v-btn
                        @click="verifySignupOtp"
                        color="primary"
                        block
                        :loading="loading"
                    >
                        Verify and create account
                    </v-btn>
                </div>

                <v-alert
                    v-if="successMessage"
                    type="success"
                    variant="tonal"
                    class="mt-3"
                >
                    {{ successMessage }}
                </v-alert>

                <v-alert
                    v-if="errorMessage"
                    type="error"
                    variant="tonal"
                    class="mt-3"
                >
                    {{ errorMessage }}
                </v-alert>

                <v-btn
                    variant="text"
                    class="mt-2"
                    block
                    @click="router.push('/login')"
                >
                    Already have an account? Log in
                </v-btn>
            </v-card-text>
        </v-card>
    </v-container>
</template>
