<template>
  <el-dialog
    v-model="visible"
    title=""
    :close-on-click-modal="false"
    :width="isMobile ? '100vw' : '600px'"
    :fullscreen="isMobile"
    class="p-0"
  >
    <div class="mx-auto w-full max-w-lg sm:max-w-2xl md:max-w-4xl rounded-lg">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="bg-white p-4 sm:p-6"
        @submit.prevent="handleSubmit"
      >
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 pb-6 sm:pb-10">新建任务</h2>
        <el-form-item label="任务名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="任务描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入任务描述"
          />
        </el-form-item>
        <el-form-item label="优先级" prop="priority" class="mb-0">
          <el-select v-model="form.priority" placeholder="请选择优先级" style="width: 100%">
            <el-option label="低" value="low" />
            <el-option label="中" value="medium" />
            <el-option label="高" value="high" />
          </el-select>
        </el-form-item>

        <el-form-item label="截止日期" prop="due_date" class="mb-0">
          <el-date-picker
            v-model="form.due_date"
            type="date"
            placeholder="请选择截止日期"
            format="YYYY/MM/DD"
            value-format="YYYY/MM/DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item>
          <div class="flex flex-row gap-4 justify-center">
            <el-button type="primary" native-type="submit" :loading="loading" class="flex-1">
              保存
            </el-button>
            <el-button
              @click="emit('update:showCreateTaskForm', false)"
              class="flex-1"
              type="danger"
            >
              取消
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useTaskStore } from '@/stores/task'
import type { FormInstance, FormRules } from 'element-plus'
import { ElNotification } from 'element-plus'
import { useWindowSize } from '@vueuse/core'

const error = computed(() => taskStore.error)
const taskStore = useTaskStore()
const loading = computed(() => taskStore.loading)
const formRef = ref<FormInstance>()
const visible = ref(false)

const props = defineProps<{
  showCreateTaskForm: boolean
}>()

const emit = defineEmits(['update:showCreateTaskForm'])

const form = ref({
  title: '',
  description: '',
  priority: 'medium' as const,
  due_date: '',
  status: 'pending' as const,
  tags: [] as { id: number; name: string; color: string }[],
  eisenhower_type: '' as string,
  start_time: '',
  end_time: '',
  project: 0,
})

const rules = ref<FormRules>({
  title: [
    { required: true, message: '请输入任务名称', trigger: 'blur' },
    { min: 3, max: 50, message: '长度应该在3到50个字符之间', trigger: 'blur' },
  ],
  description: [{ required: true, message: '请输入任务描述', trigger: 'blur' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
})

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 640)

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      await taskStore.createTask(form.value)

      if (error.value) {
        ElNotification({
          title: '创建任务失败',
          message: error.value,
          type: 'error',
        })
      } else {
        ElNotification({
          title: '创建任务成功',
          message: '创建任务成功',
          type: 'success',
        })
        emit('update:showCreateTaskForm', false)
        await taskStore.fetchTasks('', '', '')
      }
    }
  })
}

onMounted(() => {
  visible.value = props.showCreateTaskForm
})

watch(
  () => props.showCreateTaskForm,
  (v) => (visible.value = v),
)
watch(visible, (v) => emit('update:showCreateTaskForm', v))
</script>

<style scoped></style>
