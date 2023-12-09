import { QueryClient, QueryClientProvider } from 'react-query';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/home';
import React from 'react';
import AppThemeProvider from './providers/AppThemeProvider';
import AlertDialogProvider from './providers/AlertDialogProvider';
import store from './models';
import { FileList } from './pages/file';
import { AppLayout } from './layout';
import { routers } from './config';
import { ImagePreview } from './pages/ImagePreview';
import { Browser } from './components/Browser';
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
      <Provider store={store}>
        <AppThemeProvider>
          <QueryClientProvider client={queryClient}>
            <SnackbarProvider maxSnack={3}>
              <AlertDialogProvider>
                <AppLayout>
                  <Routes>
                    <Route path={routers.FILES} element={<FileList />} />
                    <Route path={routers.HOME} element={<Home />} />
                    <Route path={routers.IMAGES} element={<ImagePreview />} />
                    <Route path={'/'} element={<Home />} />
                  </Routes>
                </AppLayout>
                <Browser />
              </AlertDialogProvider>
            </SnackbarProvider>
          </QueryClientProvider>
        </AppThemeProvider>
      </Provider>
    </Router>
  );
}
