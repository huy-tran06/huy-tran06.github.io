<script setup>
import { ref } from "vue"
import { useTaskStore } from "../stores/taskStore"

const props = defineProps({
    unitId: {
        type: String,
        required: true
    }
})

const taskStore = useTaskStore()

const title = ref("")
const description = ref("")
const price = ref(null)
const priority = ref("medium")

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
}

</script>