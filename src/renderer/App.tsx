import { QueryClient, QueryClientProvider } from 'react-query';
import { SnackbarProvider } from 'notistack';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/home';
import React from 'react';
import AppThemeProvider from './providers/AppThemeProvider';
import AlertDialogProvider from './providers/AlertDialogProvider';
import { AppLayout } from './layout';
import { routers } from './config';
import { ImagePreview } from './pages/ImagePreview';
import { Browser } from './components/Browser';
import { WallpaperProvider } from './providers/WallpaperProvider';
// import 'react-virtualized/styles.css'; // only needs to be imported once

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default function App() {
  return (
    <Router>
      <AppThemeProvider>
        <QueryClientProvider client={queryClient}>
          <SnackbarProvider maxSnack={3}>
            <AlertDialogProvider>
              <WallpaperProvider>
                <AppLayout>
                  <Routes>
                    <Route path={routers.HOME} element={<Home />} />
                    <Route path={routers.IMAGES} element={<ImagePreview />} />
                    <Route path={'/'} element={<Home />} />
                  </Routes>
                </AppLayout>
              </WallpaperProvider>
              <Browser />
            </AlertDialogProvider>
          </SnackbarProvider>
        </QueryClientProvider>
      </AppThemeProvider>
    </Router>
  );
}
