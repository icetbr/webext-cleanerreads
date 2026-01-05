import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import webExtension from "@samrum/vite-plugin-web-extension";
// export default defineConfig(({ command, mode }) => {

// https://vitejs.dev/config/
export default defineConfig({
build: {
    // 1. Prevents minification so your code remains readable
    minify: false,

    // 2. Prevents Vite from adding its own polyfills or "shims"
    target: 'esnext',

    // lib: {
    //   entry: './src/main.js', // Your entry file
    //   formats: ['es'],        // Use 'es' to keep modern import/export syntax
    //   fileName: 'my-bundle'
    // },

    rollupOptions: {
      // 3. Ensure external dependencies aren't bundled if you don't want them
      external: ['node:util', 'util'],
      output: {
        // Keeps the output cleaner
        preserveModules: false,
      },
    },
},
  plugins: [
    monkey({
      entry: 'src/content.js',
      userscript: {
        downloadURL: 'https://openuserjs.org/src/scripts/icetbr/CleanerReads.user.js',
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'npm/vite-plugin-monkey',
        match: ['https://www.goodreads.com/*'],
      },
    }),
    // webExtension({
    //   manifest: {
    //     name: 'phkName',
    //     description: 'phkDec',
    //     version: '1.0.0',
    //     manifest_version: 3,
    // "content_scripts": [
    //     {
    //         "matches": ["https://www.goodreads.com/*"],
    //         "js": ["src/content.ts"],
    //         "run_at": "document_start"
    //     }
    // ],
    //   },
    // })
  ],
});
