import ReactDOM from 'react-dom/client'
import { RouterProvider} from 'react-router-dom'
import { Provider } from "react-redux"
import { store } from './stores/stores';
import "./assets/css/app.css";
import './i18n.ts'
import { router } from './router';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store} stabilityCheck="never">
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: false,
      }}
    />
  </Provider>
)
