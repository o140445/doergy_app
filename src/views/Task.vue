<template>
  <MainLayout>
    <div class="mx-auto max-w-7xl px-2 h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      <!-- 整个右侧内容区域可滚动 -->
      <div class="flex-1 overflow-y-auto scrollbar-hide p-1">
        <!-- 搜索和进度区域 -->
        <div class="flex-shrink-0">
          <div
            class="md:p-6 p-2 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5 transition-all"
          >
            <el-form :model="form" class="flex flex-wrap gap-2 items-end">
              <div class="flex-1 min-w-[200px]">
                <el-input
                  v-model="form.search"
                  placeholder="搜索任务..."
                  class="!w-full"
                  :prefix-icon="Search"
                />
              </div>

              <div class="flex gap-4">
                <el-select
                  v-model="form.priority"
                  placeholder="优先级"
                  class="!w-[120px]"
                  clearable
                >
                  <el-option label="高" value="high">
                    <div class="flex items-center">
                      <span>高</span>
                    </div>
                  </el-option>
                  <el-option label="中" value="medium">
                    <div class="flex items-center">
                      <span>中</span>
                    </div>
                  </el-option>
                  <el-option label="低" value="low">
                    <div class="flex items-center">
                      <span>低</span>
                    </div>
                  </el-option>
                </el-select>

                <el-select v-model="form.status" placeholder="状态" class="!w-[120px]" clearable>
                  <el-option label="待办" value="pending">
                    <div class="flex items-center">
                      <span>待办</span>
                    </div>
                  </el-option>
                  <el-option label="已完成" value="completed">
                    <div class="flex items-center">
                      <span>已完成</span>
                    </div>
                  </el-option>
                </el-select>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
              </div>
            </el-form>
          </div>

          <!-- progress -->
          <div
            :style="{ marginTop: '10px', marginBottom: '10px' }"
            class="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5 transition-all md:p-4 p-2"
          >
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-2 text-sm text-gray-500 whitespace-nowrap">
                <span>今日任务完成率: </span>
                <span class="font-bold"
                  >{{ taskStore.day_completed }} / {{ taskStore.day_total }}</span
                >
              </div>
              <div class="flex-1">
                <el-progress :percentage="todayTaskCompletionRate" />
              </div>
            </div>
          </div>

          <div
            :style="{ marginTop: '10px', marginBottom: '10px' }"
            class="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5 transition-all md:py-4 py-2 md:block hidden"
          >
            <el-row :gutter="16">
              <el-col :span="8">
                <el-statistic title="待办" :value="todoTasks" />
              </el-col>
              <el-col :span="8">
                <el-statistic title="已完成" :value="completedTasks" />
              </el-col>

              <el-col :span="8">
                <el-statistic title="总数" :value="totalTasks" />
              </el-col>
            </el-row>
          </div>
        </div>

        <!-- 任务列表区域 -->
        <div class="flex-1">
          <TaskList />
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTaskStore } from '@/stores/task'
import MainLayout from '@/layouts/MainLayout.vue'
import { Search } from '@element-plus/icons'
import TaskList from '@/components/TaskList.vue'

// 定义组件名称
defineOptions({
  name: 'TaskView',
})

const taskStore = useTaskStore()
const form = ref({
  search: '',
  priority: '',
  status: '',
})

// 搜索处理函数
const handleSearch = () => {
  taskStore.fetchTasks(form.value.search, form.value.priority, form.value.status)
}

const totalTasks = computed(() => {
  return taskStore.tasks.length || 0
})

const completedTasks = computed(() => {
  return taskStore.getTasksByStatus('completed').length || 0
})

const todoTasks = computed(() => {
  return taskStore.getTasksByStatus('pending').length || 0
})

// 任务完成率
const todayTaskCompletionRate = computed(() => {
  const day_total = taskStore.day_total
  const day_completed = taskStore.day_completed

  if (day_total === 0) {
    return 0
  }

  const percentage = (day_completed / day_total) * 100

  return Math.round(percentage)
})
</script>

<style scoped>
.el-button + .el-button {
  margin-left: 0;
}

.el-col {
  text-align: center;
}

.scrollbar-hide {
  /* Firefox */
  scrollbar-width: none;
  /* IE and Edge */
  -ms-overflow-style: none;
}

.scrollbar-hide::-webkit-scrollbar {
  /* Chrome, Safari and Opera */
  display: none;
}
</style>
