<template>
  <Index>
    <div class="flex w-full min-h-[calc(100vh-4rem)] bg-gradient-to-br flex-col">
      <div class="w-full h-full flex items-center justify-center pt-20 pb-4 px-2 gap-4 flex-col">
        <div class="w-full flex flex-col items-center gap-4">
          <h2 class="text-gray-900 text-center text-xl font-bold">
            Doergy 是一个任务管理工具，可以帮助你更好地管理你的任务。
          </h2>
          <el-button class="" type="primary" @click="demo" :icon="Odometer"> 体验一下</el-button>
        </div>

        <!-- 分割线 -->
        <div class="w-full md:w-2/3 lg:w-1/2 flex items-center justify-center">
          <div class="w-full h-full border-t border-gray-200"></div>
        </div>

        <!-- img -->
        <div class="w-full md:w-2/3 lg:w-1/2 flex items-center justify-center p-4">
          <img src="@/assets/index-task.jpg" alt="index" class="w-full h-full rounded-lg" />
        </div>

        <!-- 关于 -->
        <div class="w-full flex flex-col items-center gap-4 py-4">
          <h3 class="text-gray-900 text-center text-lg font-bold">关于 Doergy</h3>
          <div class="w-full md:w-2/3 lg:w-1/2 grid md:grid-cols-3 gap-6 text-center">
            <div class="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <!-- <div
                class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3"
              >
                <el-icon size="24" color="#3B82F6">
                  <Check />
                </el-icon>
              </div> -->
              <h4 class="font-semibold text-gray-900 mb-2">简单易用</h4>
              <p class="text-gray-600 text-sm">直观的界面设计，让任务管理变得简单高效</p>
            </div>
            <div class="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <h4 class="font-semibold text-gray-900 mb-2">时间管理</h4>
              <p class="text-gray-600 text-sm">设置截止日期，合理安排时间，提高工作效率</p>
            </div>
            <div class="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <h4 class="font-semibold text-gray-900 mb-2">进度跟踪</h4>
              <p class="text-gray-600 text-sm">实时查看任务完成情况，掌握工作进度</p>
            </div>
          </div>
        </div>

        <!-- 联系方式 -->
        <div class="w-full flex flex-col items-center gap-4 py-4">
          <h3 class="text-gray-900 text-center text-lg font-bold">联系我们</h3>
          <div class="flex items-center gap-6 flex-col">
            <span class="text-center text-gray-600">如果你有什么问题或者想法，可以联系我们</span>
            <div
              class="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <el-icon size="16">
                <Message />
              </el-icon>
              <a class="text-sm" href="mailto:doergy@gmail.com">doergy@gmail.com</a>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部 footer 定位在底部-->
      <div class="w-full py-2 flex items-center justify-center border-t border-gray-200">
        <span class="text-gray-600 text-center text-sm">@Doergy 2025</span>
      </div>
    </div>
  </Index>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Index from '@/layouts/Index.vue'
import { Odometer, Message } from '@element-plus/icons'
import { useAuthStore } from '@/stores/auth'
import { ElNotification } from 'element-plus'

const router = useRouter()
const auth = useAuthStore()

const demo = async () => {
  // 模拟登录
  await auth.login('demo@doergy.com', '123456')
  ElNotification({
    title: '登录成功',
    message: '欢迎体验！',
    type: 'success',
    duration: 3000,
  })

  router.push('/task')
}

defineOptions({
  name: 'IndexView',
})

onMounted(async () => {
  // 如果用户已经登录，则跳转到任务页面
  if (auth.user.email) {
    router.push('/task')
  } else {
    router.push('/')
  }
})
</script>

<style scoped>
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
