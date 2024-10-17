'use client'

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ThemeProvider } from './components/ThemeProvider'
import { Login } from './pages/login/Login'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import AppContext from './pages/app'
import { Layout } from './components/Layout'
import { client } from './lib/apollo-client'

const queryClient = new QueryClient()


export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ApolloProvider client={client}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Layout />}>
                <Route path="admin/*" element={<AdminDashboard />} />
                <Route path="app/*" element={<AppContext />} />
                <Route index element={<Navigate to="/login" replace />} />
              </Route>
            </Routes>
          </Router>
        </QueryClientProvider>
      </ApolloProvider>
    </ThemeProvider>
  )
}