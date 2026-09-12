import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
      host: true, // localhost뿐 아니라 네트워크 IP(192.168.x.x)로도 접속 가능하게
    proxy: {
      // /api로 시작하는 요청은 전부 백엔드로 대신 보내줌 (같은 origin처럼 보이게 해서
      // SameSite=Lax 쿠키 문제를 근본적으로 피함)
      '/api': {
        target: 'http://192.168.0.203:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
