<template>
  <el-dialog
    v-model="visible"
    title=""
    :close-on-click-modal="false"
    :width="isMobile ? '100vw' : '600px'"
    :fullscreen="isMobile"
  >
    <div class="mx-auto w-full max-w-lg sm:max-w-2xl md:max-w-4xl">
      <el-form
        ref="formRef"
        :model="form"
        label-position="top"
        :rules="rules"
        class="bg-white p-4 sm:p-6"
      >
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 pb-6 sm:pb-10">编辑任务</h2>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="form.priority">
            <el-option label="低" value="low" />
            <el-option label="中" value="medium" />
            <el-option label="高" value="high" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止日期" prop="due_date">
          <el-date-picker
            v-model="form.due_date"
            type="date"
            format="YYYY/MM/DD"
            value-format="YYYY/MM/DD"
          />
        </el-form-item>
        <!-- <el-form-item label="时间">
          <el-row :gutter="20">
            <el-col :span="11">
              <el-time-select
                v-model="form.start_time"
                :max-time="form.end_time"
                placeholder="开始时间"
                start="00:00"
                step="00:05"
                end="23:55"
                style="width: 100%"
              />
            </el-col>
            <el-col :span="2" class="text-center">
              <span class="text-gray-500">-</span>
            </el-col>
            <el-col :span="11">
              <el-time-select
                v-model="form.end_time"
                :min-time="form.start_time"
                placeholder="结束时间"
                start="00:00"
                step="00:05"
                end="23:55"
                style="width: 100%"
              />
            </el-col>
          </el-row>
        </el-form-item> -->
        <el-form-item>
          <div class="flex flex-row gap-4 justify-center">
            <el-button type="primary" @click="handleSubmit" class="w-full sm:flex-1"
              >保存</el-button
            >
            <el-button @click="close" class="w-full sm:flex-1" type="danger">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, computed } from 'vue'
import { useTaskStore, type Task } from '@/stores/task'
import type { FormInstance, FormRules } from 'element-plus'
import { ElNotification } from 'element-plus'
import { useWindowSize } from '@vueuse/core'

const props = defineProps<{
  modelValue: boolean
  task: Task | null
}>()
const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(props.modelValue)
watch(
  () => props.modelValue,
  (v) => (visible.value = v),
)
watch(visible, (v) => emit('update:modelValue', v))

const formRef = ref<FormInstance>()
const form = ref<Partial<Task>>({})
const taskStore = useTaskStore()
const error = computed(() => taskStore.error)

watch(
  () => props.task,
  (task) => {
    if (task) {
      form.value = { ...task }
    }
  },
  { immediate: true },
)

const rules = ref<FormRules>({
  title: [
    { required: true, message: '请输入任务标题', trigger: 'blur' },
    { min: 3, max: 50, message: '长度应为3到50个字符', trigger: 'blur' },
  ],
  description: [{ required: true, message: '请输入任务描述', trigger: 'blur' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
})

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 640)

const handleSubmit = async () => {
  if (!formRef.value || !props.task) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      await taskStore.updateTask(props.task!.id, form.value)
      if (error.value) {
        ElNotification({
          title: '编辑任务失败',
          message: error.value,
          type: 'error',
        })
      } else {
        ElNotification({
          title: '编辑任务成功',
          message: '编辑任务成功',
          type: 'success',
        })
        emit('update:modelValue', false)
        await taskStore.fetchTasks('', '', '')
      }
    }
  })
}

function close() {
  visible.value = false
}
</script>
