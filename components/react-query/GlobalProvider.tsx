'use client'
import { QueryClientProvider,QueryClient, useQuery } from '@tanstack/react-query';


const queryClient = new QueryClient();
const GlobalProvider = (Children: any) => {
  return ( () => (
    <QueryClientProvider client={queryClient}>
      {<Children /> }
    </QueryClientProvider>
  )
  );
};

export default GlobalProvider;