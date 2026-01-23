<script setup>
    import { ref } from "vue"
    import { supabase } from "../lib/supabase"


    const email = ref("")

    async function login(){
        const result = await supabase.auth.signInWithOtp({email: email.value})
        const error = result.error

        if (error){
            alert(error.message)
        }
        else{
            alert("Check your email")
        }
    }
</script>

<template>

    <div>
        <h1>Login</h1>
        <input v-model="email" placeholder="Email"/>
        <button @click="login">Test send</button>
    </div>
    
</template>