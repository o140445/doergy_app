<template>
  <div class="min-h-screen w-full bg-gray-50">
    <div class="w-full bg-white shadow flex justify-center">
      <!-- 顶部导航 -->
      <header class="max-w-7xl w-full">
        <div class="max-w-7xl mx-auto lg:px-4 px-2">
          <el-menu class="el-menu-demo" mode="horizontal" :ellipsis="false" :router="true">
            <el-menu-item @click="olickIndex">
              <img style="width: 100px" src="@/assets/logo.png" alt="Doergy Logo" />
            </el-menu-item>

            <!-- login -->
            <div v-if="!auth.token" class="flex items-center gap-2 text-sm">
              <el-button
                class=""
                type="primary"
                @click="router.push('/login')"
                :icon="User"
                size="small"
              >
                登录
              </el-button>
              <el-button
                plain
                class=""
                type="primary"
                @click="router.push('/register')"
                :icon="UserFilled"
                size="small"
              >
                注册
              </el-button>
              <!-- dome -->
              <!-- <el-button class="" type="success" @click="dome" :icon="Odometer" size="small">
                dome
              </el-button> -->
            </div>

            <!-- email 下拉框 退出 -->
            <el-dropdown
              trigger="click"
              class="!text-base hover:bg-blue-50 px-2"
              v-if="auth.token"
              size="large"
            >
              <el-button link class="!text-base">
                {{ auth.user.email }}<el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="auth.logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

            <!-- 多语言切换菜单下拉框 -->
            <!-- <el-dropdown trigger="click" class="!text-base hover:bg-blue-50">
              <el-button link class="!text-base">
                {{ Language }}<el-icon class="el-icon--right"><Switch /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleLanguage('中文')">中文</el-dropdown-item>
                  <el-dropdown-item @click="handleLanguage('English')">English</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown> -->
          </el-menu>
        </div>
      </header>
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
// import { ref } from 'vue'
import { ArrowDown, User, UserFilled } from '@element-plus/icons'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

// 定义组件名称
defineOptions({
  name: 'MainIndex',
})

// const Language = ref('中文')
const auth = useAuthStore()
const router = useRouter()
// const handleLanguage = (lang: string) => {
//   Language.value = lang
// }

const olickIndex = () => {
  // 如果用户已经登录，则跳转到任务页面
  if (auth.user.email) {
    router.push('/task')
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}

.el-menu--horizontal.el-menu {
  border-bottom: none;
  text-decoration: none;
}

.el-menu--vertical.el-menu {
  border-right: none;
  text-decoration: none;
}
.el-button + .el-button {
  margin-left: 0;
}
</style>
