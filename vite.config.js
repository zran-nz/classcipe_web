/* eslint-disable */
import legacyPlugin from '@vitejs/plugin-legacy';
// import usePluginImport from 'vite-plugin-importer';
import styleImport from 'vite-plugin-style-import';
import vitePluginImp from 'vite-plugin-imp';
import * as path from 'path';
import {
  createVuePlugin
} from 'vite-plugin-vue2';
// @see https://cn.vitejs.dev/config/
export default ({
  command,
  mode
}) => {
  let rollupOptions = {};


  let optimizeDeps = {};


  let alias = {
    '.git': path.resolve(__dirname, './.git'),
    '.github': path.resolve(__dirname, './.github'),
    'config': path.resolve(__dirname, './config'),
    'dist': path.resolve(__dirname, './dist'),
    'docker': path.resolve(__dirname, './docker'),
    'node_modules': path.resolve(__dirname, './node_modules'),
    'public': path.resolve(__dirname, './public'),
    'src': path.resolve(__dirname, './src'),
    'tests': path.resolve(__dirname, './tests'),
    '@': path.resolve(__dirname, './src'),
    'vue$': 'vue/dist/vue.runtime.esm.js',
    '@$': path.resolve(__dirname, './src'),
  }

  let proxy = {
    '/classcipe': {
      "target": " https://dev.classcipe.com/",
      "ws": false,
      "changeOrigin": true
    },
    '/fio': {
      "target": " https://dev.classcipe.com/",
      "ws": true,
      "changeOrigin": true
    },
  }

  // todo 替换为原有变量
  let define = {
    'process.env.NODE_ENV': command === 'serve' ? '"development"' : '"production"',
    'process.env.NODE_ENV': '"development"',
    'process.env.VUE_APP_PREVIEW': '"false"',
    'process.env.VUE_APP_API_BASE_URL': '"https://dev.classcipe.com"',
    'process.env.VUE_APP_LESSON_API_BASE_URL': '"https://dev.api.classcipe.com"',
    'process.env.VUE_APP_LESSON_HOST_BASE_URL': '"https://dev.frontend.classcipe.com"',
    'process.env.VUE_APP_BASE_URL': '"https://dev.classcipe.com"',
    'process.env.VUE_APP_SHARE_URL': '"https://test.classcipe.com"',
    'process.env.VUE_APP_API_KEY': '"AIzaSyDh-aLBR7Gzd8-XQOKQAdoExwlIoi_AHEk"',
    'APP_VERSION.0': '"',
    'APP_VERSION.1': '3',
    'APP_VERSION.2': '.',
    'APP_VERSION.3': '0',
    'APP_VERSION.4': '.',
    'APP_VERSION.5': '0',
    'APP_VERSION.6': '"',
    'GIT_HASH.0': '"',
    'GIT_HASH.1': '8',
    'GIT_HASH.2': '4',
    'GIT_HASH.3': '6',
    'GIT_HASH.4': '5',
    'GIT_HASH.5': '7',
    'GIT_HASH.6': '9',
    'GIT_HASH.7': '6',
    'GIT_HASH.8': '4',
    'GIT_HASH.9': '"',
    'BUILD_DATE.0': '"',
    'BUILD_DATE.1': '8',
    'BUILD_DATE.2': '/',
    'BUILD_DATE.3': '2',
    'BUILD_DATE.4': '9',
    'BUILD_DATE.5': '/',
    'BUILD_DATE.6': '2',
    'BUILD_DATE.7': '0',
    'BUILD_DATE.8': '2',
    'BUILD_DATE.9': '2',
    'BUILD_DATE.10': ',',
    'BUILD_DATE.11': ' ',
    'BUILD_DATE.12': '8',
    'BUILD_DATE.13': ':',
    'BUILD_DATE.14': '4',
    'BUILD_DATE.15': '1',
    'BUILD_DATE.16': ':',
    'BUILD_DATE.17': '5',
    'BUILD_DATE.18': '0',
    'BUILD_DATE.19': ' ',
    'BUILD_DATE.20': 'A',
    'BUILD_DATE.21': 'M',
    'BUILD_DATE.22': '"',
  }

  let esbuild = {}

  return {
    base: './', // index.html文件所在位置
    root: './', // js导入的资源路径，src
    resolve: {
      alias,
    },
    define: define,
    server: {
      // 代理
      proxy,
    },
    build: {
      target: 'es2015',
      minify: 'terser', // 是否进行压缩,boolean | 'terser' | 'esbuild',默认使用terser
      manifest: false, // 是否产出maifest.json
      sourcemap: false, // 是否产出soucemap.json
      outDir: 'build', // 产出目录
      rollupOptions,
    },
    esbuild,
    optimizeDeps,
    plugins: [
      createVuePlugin(), legacyPlugin({
        targets: ['Android > 39', 'Chrome >= 60', 'Safari >= 10.1', 'iOS >= 10.3', 'Firefox >= 54', 'Edge >= 15'],
      // }), usePluginImport({
      //   libraryName: " ", // todo please input your babel-plugin-import config
      //   libraryDirectory: " ",
      //   style: "css",
      }),
      vitePluginImp({
        libList: [
          {
            libName: "antd",
            style: (name) => `antd/es/${name}/style`,
          },
        ],
      }),
      styleImport({
        libs: [
          {
            libraryName: 'ant-design-vue',
            esModule: true,
            resolveStyle: (name) => {
              return `ant-design-vue/es/${name}/style/index`
            },
          }
        ],
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          // 支持内联 JavaScript
          javascriptEnabled: true,
        },
      },
    },
  };
};