import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/components'),
      '@/hooks': resolve(__dirname, './src/hooks'),
      '@/utils': resolve(__dirname, './src/utils'),
      '@/types': resolve(__dirname, './src/types'),
      '@/constants': resolve(__dirname, './src/constants'),
      '@/data': resolve(__dirname, './src/data'),
    },
  },
  
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react'],
          utils: ['clsx', 'date-fns'],
        },
      },
    },
  },
  
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react', 'clsx', 'date-fns'],
  },
});
