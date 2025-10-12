import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
    plugins: [
        devtools({
            removeDevtoolsOnBuild: true,
            enhancedLogs: {
                enabled: true,
            },
        }),
        tanstackRouter({
            target: 'react',
            autoCodeSplitting: true,
        }),
        tailwindcss(),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            buffer: 'buffer',
            'node:buffer': 'buffer',
            string_decoder: 'string_decoder',
            'node:string_decoder': 'string_decoder',
        },
    },
    define: {
        global: 'globalThis',
    },
    optimizeDeps: {
        include: ['buffer', 'safer-buffer', 'safe-buffer', 'iconv-lite', 'string_decoder'],
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react-aria-components')) return 'react-aria';
                        if (id.includes('@tanstack')) return 'tanstack';
                        if (id.includes('react')) return 'react';
                        if (id.includes('iconv-lite')) return 'iconv-lite';
                        if (id.includes('lucide-react')) return 'icons';
                    }
                    return undefined;
                },
            },
        },
        chunkSizeWarningLimit: 600,
    },
})