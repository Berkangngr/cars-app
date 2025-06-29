import { Box, CircularProgress } from '@mui/material';
import { useAuthStore } from '../zustand/authStore';

const GlobalLoadingSpinner = () => {
  const isLoading = useAuthStore((state) => state.isLoading); // Global loading durumunu alıyoruz

  if (!isLoading) return null; // Loading durumu false ise spinner'ı göstermiyoruz

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999, // Diğer içeriklerin önünde olması için yüksek z-index
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default GlobalLoadingSpinner;
