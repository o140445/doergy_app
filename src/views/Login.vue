<template>
  <Index>
    <div
      class="flex items-center w-full min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      <div class="w-full h-full flex items-center justify-center p-4">
        <div class="w-full max-w-md">
          <!-- 卡片容器 -->
          <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <!-- Logo/标题区域 -->
            <div class="text-center pb-6">
              <!-- <div
                class="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <el-icon size="32" color="white">
                  <User />
                </el-icon>
              </div> -->
              <h1 class="text-3xl font-bold text-gray-900 mb-2">欢迎回来</h1>
              <p class="text-gray-600">请登录您的账户</p>
            </div>

            <!-- 登录表单 -->
            <el-form
              ref="formRef"
              :model="form"
              :rules="rules"
              label-position="top"
              class="space-y-6"
            >
              <el-form-item label="邮箱地址" prop="email">
                <el-input
                  v-model="form.email"
                  placeholder="请输入邮箱地址"
                  size="large"
                  :prefix-icon="Message"
                />
              </el-form-item>

              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="form.password"
                  placeholder="请输入密码"
                  type="password"
                  size="large"
                  :prefix-icon="Lock"
                  show-password
                />
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  @click="handleSubmit"
                  class="w-full h-12 text-lg font-medium"
                  :loading="loading"
                  size="large"
                >
                  {{ loading ? '登录中...' : '登录' }}
                </el-button>
              </el-form-item>
            </el-form>

            <!-- 分割线 -->
            <div class="relative my-8">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-white text-gray-500">或者</span>
              </div>
            </div>

            <!-- 底部链接 -->
            <div class="text-center">
              <p class="text-gray-600">
                还没有账户？
                <router-link
                  to="/register"
                  class="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  立即注册
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Index>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Index from '@/layouts/Index.vue'
import { ElNotification, type FormInstance, type FormRules } from 'element-plus'
import { Message, Lock } from '@element-plus/icons'

const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)
const formRef = ref<FormInstance>()

defineOptions({
  name: 'LoginView',
})

const form = ref({
  email: '',
  password: '',
})

const rules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    await auth.login(form.value.email, form.value.password)

    ElNotification({
      title: '登录成功',
      message: '欢迎回来！',
      type: 'success',
      duration: 3000,
    })

    router.push('/task')
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '登录失败，请检查邮箱和密码'

    ElNotification({
      title: '登录失败',
      message: errorMessage,
      type: 'error',
      duration: 3000,
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.el-form-item__label {
  font-weight: 500;
  color: #374151;
}

.el-input__wrapper {
  border-radius: 8px;
}

.el-button {
  border-radius: 8px;
}
</style>
