
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthContext from './context/AuthContext.jsx'
import { BrowserRouter } from 'react-router'
import { Provider } from 'react-redux'
import { store } from './app/store.js'
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <AuthContext>
        <Toaster />
        <App />
      </AuthContext>
    </Provider>
  </BrowserRouter>
)
