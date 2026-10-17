import { defineConfig } from '@rspress/core';
import mermaid from 'rspress-plugin-mermaid';

export default defineConfig({
  root: 'docs',
  // Set by the GitHub Pages workflow (e.g. /my-repo/); '/' for local dev.
  base: process.env.BASE_PATH ?? '/',
  title: 'My Cheatsheets',
  description: 'Personal cheatsheets: CLI tools, architecture patterns, concepts.',
  icon: '/favicon.svg',
  plugins: [mermaid()],
  themeConfig: {
    socialLinks: [],
  },
});
