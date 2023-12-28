import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  base: '/tiny-image-editor/',
  publicPath: '/tiny-image-editor/docs-dist/',
  themeConfig: {
    name: 'tiny-image-editor',
  },
});
