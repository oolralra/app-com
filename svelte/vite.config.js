import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    // 0.0.0.0으로 설정하면 모든 네트워크 인터페이스에서 연결을 수락합니다.
    host: '0.0.0.0',
  },
});
