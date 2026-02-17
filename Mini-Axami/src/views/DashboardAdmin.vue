<script setup>
import { supabase } from "../lib/supabase";

async function testCreateUnit() {
    console.log("Function triggered!")
    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user

    const { data, error } = await supabase
    .from("units")
    .insert({
        name: "Test Unit",
        description: "Temporary test",
        owner_id: user.id
    })

  console.log("DATA:", data)
  console.log("ERROR:", error)
}

</script>

<template>
    <div>
        <h1>Admin Dashboard</h1>
    </div>

    <button @click="testCreateUnit">
        Create test unit
    </button>
</template>