import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './'    // 默认是根路径，修改为相对路径。否则部署github pages时，会去https://xxx.github.io/这个路径下找资源，结果会找不到。
})
