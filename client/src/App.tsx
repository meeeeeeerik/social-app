import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { useAppSelector } from './app/hooks';
import { store } from './app/store';
import { getTheme } from './theme';
import Navbar from './components/Navbar/Navbar';
import Feed from './pages/Feed/Feed';
import Profile from './pages/Profile/Profile';
import Auth from './pages/Auth/Auth';

const AppContent = () => {
  const dark = useAppSelector(s => s.ui.darkMode);
  return (
    <ThemeProvider theme={getTheme(dark)}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/*" element={
            <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
              <Navbar />
              <Routes>
                <Route path="/" element={<Feed />} />
                <Route path="/profile/:id" element={<Profile />} />
              </Routes>
            </Box>
          } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

const App = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default App;
