<script setup>
import { ref } from "vue";
import { supabase } from "../lib/supabase";
import { useRouter } from "vue-router";

const router = useRouter()

const email = ref("")
const otp = ref("")
const otpSent = ref(false)

async function sendOtp() {
    const result = await supabase.auth.signInWithOtp({email: email.value})
    const error = result.error

    if(error){
        alert(error.message)
    }
    else{
        otpSent.value = true
    }
}

async function verifyOtp() {
    const data = await supabase.auth.verifyOtp({
        email: email.value,
        token: otp.value,
        type: "email"
    })
    const error = data.error
    console.log({ data, error })
    
    if(error){
        alert(error.message)
    }
    else{
        alert("Logged in!")
        router.push("/dashboard")
    }
}
</script>

<template>
    <div>
        <h1>Login with OTP</h1>

        <div v-if="!otpSent">
            <input v-model="email" placeholder="Email">
            <button @click="sendOtp">Send OTP</button>
        </div>

        <div v-else>
            <input v-model="otp" placeholder="Enter OTP code">
            <button @click="verifyOtp">Verify OTP</button>
        </div>
    </div>
</template>