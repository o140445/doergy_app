<template>
  <Index>
    <div class="w-full flex justify-center min-h-[calc(100vh-4rem)] md:gap-1">
      <div class="max-w-7xl w-full flex flex-row pt-2 gap-1">
        <div class="md:w-1/5 md:flex hidden md:p-4 p-2 flex-col bg-white gap-8">
          <!-- 快捷操作 -->
          <div class="flex flex-col gap-3 p-2 border-b border-gray-200">
            <el-button
              @click="showCreateTaskForm = true"
              type="primary"
              class="!w-full !rounded-lg"
            >
              新建任务
            </el-button>
            <!-- <el-button
              @click="showCreateProjectForm = true"
              type="primary"
              class="!w-full !rounded-lg"
            >
              Create New Project
            </el-button> -->
          </div>

          <!-- 日历 -->
          <!-- <div class="flex flex-col gap-2 border-b border-gray-200">
            <div
              class="flex items-center mb-3 gap-2 rounded-lg p-2 cursor-pointer transition-colors duration-200 hover:bg-gray-100 justify-center"
            >
              <el-icon class="mr-2" color="blue"><Calendar /></el-icon>
              <h3 class="text-base font-semibold text-gray-700">Calendar</h3>
            </div>
          </div> -->

          <!-- 最近任务 -->
          <!-- <div class="flex flex-col gap-2 p-2 border-b border-gray-200">
            <div class="flex items-center mb-3 gap-2">
              <el-icon class="mr-2" color="green"><Calendar /></el-icon>
              <h3 class="text-base font-semibold text-gray-700">Recent Tasks</h3>
            </div>
            <div class="flex flex-col gap-2 hover:bg-gray-100 rounded-lg p-2">
              <el-button link class="!w-full !justify-start hover:bg-gray-700 rounded-lg py-2">
                <el-icon class="mr-2" color="green"><Timer /></el-icon>
                <span class="text-gray-600">Today</span>
              </el-button>
            </div>
            <div class="flex flex-col gap-2 hover:bg-gray-100 rounded-lg p-2">
              <el-button link class="!w-full !justify-start hover:bg-gray-700 rounded-lg py-2">
                <el-icon class="mr-2" color="green"><Calendar /></el-icon>
                <span class="text-gray-600">7 Days</span>
              </el-button>
            </div>
          </div> -->

          <!-- 所有项目 -->
          <!-- <div class="flex flex-col gap-2 p-2 border-b border-gray-200">
            <div class="flex items-center mb-3 gap-2">
              <el-icon class="mr-2" color="purple"><Folder /></el-icon>
              <h3 class="text-base font-semibold text-gray-700">All Projects</h3>
            </div>
            <div class="flex flex-col gap-2 hover:bg-gray-100 rounded-lg p-2">
              <el-button link class="!w-full !justify-start hover:bg-gray-700 rounded-lg py-2">
                <el-icon class="mr-2" color="green"><Folder /></el-icon>
                <span class="text-gray-600">Project 1</span>
              </el-button>
            </div>
          </div> -->

          <!-- tags -->
          <!-- <div class="flex flex-col gap-2 p-2 border-b border-gray-200">
            <div class="flex items-center mb-3 gap-2">
              <el-icon class="mr-2" color="orange"><Collection /></el-icon>
              <h3 class="text-base font-semibold text-gray-700">Tags</h3>
            </div>
            <div class="flex flex-wrap gap-2">
              <el-tag size="small" class="cursor-pointer hover:opacity-80">Tag 1</el-tag>
              <el-tag size="small" type="success" class="cursor-pointer hover:opacity-80"
                >Tag 2</el-tag
              >
              <el-tag size="small" type="warning" class="cursor-pointer hover:opacity-80"
                >Tag 3</el-tag
              >
              <el-tag size="small" type="danger" class="cursor-pointer hover:opacity-80"
                >Tag 4</el-tag
              >
            </div>
          </div> -->
        </div>
        <main class="md:p-6 p-2 pb-0 bg-white md:w-4/5 w-full">
          <slot />
        </main>
      </div>
      <div
        class="fixed inset-0 z-50 bg-black/50 flex justify-center items-center"
        v-if="showCreateTaskForm"
        @click.self="showCreateTaskForm = false"
      >
        <CreateTask v-if="showCreateTaskForm" v-model:showCreateTaskForm="showCreateTaskForm" />
      </div>
      <div
        class="fixed inset-0 z-50 bg-black/50 flex justify-center items-center"
        v-if="showCreateProjectForm"
        @click.self="showCreateProjectForm = false"
      >
        <CreateProject
          v-if="showCreateProjectForm"
          :showCreateProjectForm="showCreateProjectForm"
          @update:showCreateProjectForm="showCreateProjectForm = false"
        />
      </div>

      <!-- 移动端 固定在底部 -->
      <div
        class="md:hidden fixed bottom-0 left-0 right-0 flex flex-col gap-3 p-2 !w-full bg-white z-50"
        v-if="!showCreateTaskForm && !showCreateProjectForm"
      >
        <div class="flex flex-col gap-3 p-2 !w-full !items-center">
          <el-button @click="showCreateTaskForm = true" type="primary" class="!w-full">
            新建任务
          </el-button>
        </div>
      </div>
    </div>
  </Index>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Index from './Index.vue'
import CreateTask from '@/components/CreateTask.vue'
import CreateProject from '@/components/CreateProject.vue'

const showCreateTaskForm = ref(false)
const showCreateProjectForm = ref(false)
</script>
<style scoped>
.el-button + .el-button {
  margin-left: 0;
}
</style>
