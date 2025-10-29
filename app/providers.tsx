"use client"; // Bu dosya hook'ları kullandığı için "use client" olmalıdır

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext'; // Mevcut AuthProvider'ın

export default function Providers({ children }: { children: React.ReactNode }) {
  // QueryClient'in her render'da yeniden oluşmasını engellemek için
  // useState ile bir kez oluştur
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // Veriyi 5 dakika "taze" kabul et
      },
    },
  }));

  return (
    // 1. React Query Provider'ı en dışa ekle
    <QueryClientProvider client={queryClient}>
      {/* 2. AuthProvider'ı onun içine taşı */}
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}