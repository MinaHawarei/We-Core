import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { useEffect } from 'react';

import axios from 'axios';



axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const appName = import.meta.env.VITE_APP_NAME || 'WE Core';

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) =>
    resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
  setup({ el, App, props }) {
    // ✅ نقرأ التوكن هنا بعد تحميل الصفحة
    const tokenTag = document.querySelector('meta[name="csrf-token"]');
    const token = tokenTag?.getAttribute('content');

    if (token) {
      axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
    } else {
      console.error('CSRF token not found');
    }
    const userIdTag = document.querySelector('meta[name="user-id"]');
    window.appUserId = userIdTag?.getAttribute('content') ?? undefined;
    const root = createRoot(el);
    root.render(<App {...props} />);
  },
  progress: {
    color: '#4B5563',
  },
});

// This will set light / dark mode on load...
initializeTheme();
