<template>
  <div class="mx-auto max-w-4xl">
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="100px"
      class="bg-white p-6 rounded-lg shadow-sm"
    >
      <h2 class="text-2xl font-bold text-gray-900 pb-10">Create New Project</h2>
      <el-input v-model="form.name" placeholder="Enter project name" style="padding-bottom: 10px" />
      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="loading">Create</el-button>
        <el-button @click="emit('update:showCreateProjectForm', false)">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FormInstance } from 'element-plus'
import { useProjectStore } from '@/stores/porject'
import { ElNotification } from 'element-plus'

const projectStore = useProjectStore()
const emit = defineEmits(['update:showCreateProjectForm'])
const form = ref({
  name: '',
})
const formRef = ref<FormInstance>()
const error = computed(() => projectStore.error)
const loading = computed(() => projectStore.loading)

const rules = ref({
  name: [{ required: true, message: 'Please enter project name', trigger: 'blur' }],
})

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      await projectStore.createProject(form.value)
      if (error.value) {
        ElNotification({
          title: 'Project creation failed',
          message: error.value,
          type: 'error',
        })
      } else {
        ElNotification({
          title: 'Project created',
          message: 'Project created successfully',
          type: 'success',
        })
        emit('update:showCreateProjectForm', false)
      }
    }
  })
}
</script>
