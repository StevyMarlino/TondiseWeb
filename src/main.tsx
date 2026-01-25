import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Provider } from "react-redux"
import { QueryClientProvider } from '@tanstack/react-query'
import { store } from './stores/stores';
import { queryClient } from './lib/query-client';
import "./assets/css/app.css";
import './i18n.ts'
import { router } from './router';
import { Toaster } from 'sonner';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store} stabilityCheck="never">
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={router}
        future={{
          v7_startTransition: false,
        }}
      />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  </Provider>
)
