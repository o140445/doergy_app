<template>
  <div class="h-full flex flex-col">
    <!-- 加载和错误状态 -->
    <div v-if="loading" class="flex justify-center py-12 flex-shrink-0">
      <div class="text-gray-500">Loading tasks...</div>
    </div>

    <!-- 任务列表区域 -->
    <div v-else class="flex-1">
      <div class="grid gap-4">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md"
        >
          <div class="flex items-center justify-between pr-2">
            <!-- 优先级 变成左边边框 -->
            <div
              class="flex items-center gap-2 border-l-4 pl-2 flex-1 min-w-0"
              :class="
                task.priority === 'high'
                  ? 'border-red-500'
                  : task.priority === 'medium'
                    ? 'border-yellow-500'
                    : 'border-green-500'
              "
              style="border-left-width: 10px"
            >
              <!-- 勾选框 完成状态打勾 -->
              <el-checkbox
                :model-value="task.status === 'completed'"
                @change="(checked: boolean) => computedStatus(task)"
              />
              <!-- 自动缩略 不换行 超出显示省略号 横线 完成状态打横线  -->
              <span
                class="ml-2 flex-1 min-w-0"
                :class="{ 'line-through': task.status === 'completed' }"
                style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
              >
                {{ task.title }}
              </span>
            </div>

            <div class="flex items-center gap-1 flex-shrink-0">
              <!-- 时间 完成不显示 -->
              <div
                class="md:flex items-center gap-1 px-2 hidden"
                style="white-space: nowrap"
                v-if="task.status !== 'completed' && task.due_date !== null"
              >
                <el-icon
                  :size="20"
                  :color="
                    task.status === 'pending'
                      ? 'var(--el-color-primary)'
                      : 'var(--el-text-color-regular)'
                  "
                >
                  <Clock />
                </el-icon>
                <span class="ml-2">{{ task.due_date }}</span>
              </div>

              <!-- 完成时间 -->
              <div
                class="md:flex items-center gap-1 px-2 hidden"
                style="white-space: nowrap"
                v-if="task.status === 'completed' && task.completed_at !== null"
              >
                <el-icon
                  :size="20"
                  :color="
                    task.status === 'completed'
                      ? 'var(--el-color-primary)'
                      : 'var(--el-text-color-regular)'
                  "
                >
                  <SuccessFilled />
                </el-icon>
                <span class="ml-2">{{ task.completed_at }}</span>
              </div>

              <!-- 优先级  按钮 高 中 低  -->
              <el-button
                size="small"
                :type="
                  task.priority === 'high'
                    ? 'danger'
                    : task.priority === 'medium'
                      ? 'warning'
                      : 'success'
                "
                v-if="task.status !== 'completed'"
              >
                {{ task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低' }}
              </el-button>

              <!-- 完成 显示恢复按钮 -->
              <el-button
                v-if="task.status === 'completed'"
                type="warning"
                size="small"
                @click="restoreTask(task)"
              >
                <el-icon>
                  <Refresh />
                </el-icon>
              </el-button>

              <!-- 编辑 -->
              <el-button type="primary" size="small" @click="editTask(task)">
                <el-icon>
                  <Edit />
                </el-icon>
              </el-button>

              <!-- 删除 -->
              <el-button type="danger" size="small" @click="deleteTask(task.id)">
                <el-icon>
                  <Close />
                </el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EditTask v-model="showEditTaskForm" :task="editTaskData" @success="handleEditSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTaskStore, type Task } from '../stores/task'
import { Close, Edit, Clock, Refresh, SuccessFilled } from '@element-plus/icons'
import { ElNotification, ElMessageBox } from 'element-plus'
import EditTask from './EditTask.vue'

const taskStore = useTaskStore()
const statusFilter = ref('all')
const error = computed(() => taskStore.error)
const loading = computed(() => taskStore.loading)

const filteredTasks = computed(() => {
  const tasks = taskStore.tasks.length ? taskStore.tasks : []
  if (statusFilter.value === 'all') {
    return tasks
  }
  return tasks.filter((task) => task.status === statusFilter.value)
})

const computedStatus = async (task: Task) => {
  try {
    await taskStore.computedStatus(task.id)
    // 如果请求成功,刷新任务列表
    await taskStore.fetchTasks('', '', '')
  } catch (error) {
    console.error('Failed to update task status:', error)
  }
}

const deleteTask = async (id: number) => {
  ElMessageBox.confirm('确定要删除该任务吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await taskStore.deleteTask(id)
      await taskStore.fetchTasks('', '', '')
      ElNotification({
        type: 'success',
        message: '删除成功',
      })
    })
    .catch(() => {
      ElNotification({
        title: '删除任务失败',
        message: error.value || '删除任务失败',
        type: 'error',
      })
    })
}

const showEditTaskForm = ref(false)
const editTaskData = ref<Task | null>(null)

const editTask = (task: Task) => {
  editTaskData.value = { ...task }
  showEditTaskForm.value = true
}

const handleEditSuccess = async () => {
  showEditTaskForm.value = false
  await taskStore.fetchTasks('', '', '')
}

const restoreTask = async (task: Task) => {
  try {
    await taskStore.restoreTask(task.id)
    // 如果请求成功,刷新任务列表
    await taskStore.fetchTasks('', '', '')
  } catch (error) {
    console.error('Failed to restore task:', error)
  }
}

onMounted(async () => {
  try {
    await taskStore.fetchTasks('', '', '')
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
  }
})
</script>
