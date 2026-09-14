import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './pages/ErrorBoundary.tsx';

import './index.css'
import App from './App.tsx'
import { AuthProvider } from './components/context/AuthContext';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: true,
		}
	}
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
	<AuthProvider>
	<QueryClientProvider client={queryClient}>
		<BrowserRouter>
			<ErrorBoundary>
				<App />
			</ErrorBoundary>
		</BrowserRouter>
	</QueryClientProvider>
	</AuthProvider>
  </StrictMode>,
)
