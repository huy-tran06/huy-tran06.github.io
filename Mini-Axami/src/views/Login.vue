<script>
    import { ref } from "vue"


    const email = ref("")

    function login(){
        console.log("Test login:", email.value)
    }
</script>

<template>

    <div>
        <h1>Login</h1>
        <input v-model="email" placeholder="Email"/>
        <button @click="login">Test send</button>
    </div>
    
</template>