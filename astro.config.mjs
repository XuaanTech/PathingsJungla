import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pathingsjungla.pages.dev', // Cambia por tu dominio
  integrations: [sitemap()],
});