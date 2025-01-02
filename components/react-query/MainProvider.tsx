import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a new instance of QueryClient
const queryClient = new QueryClient();

// Define the HOC
const withQueryClientProvider = (WrappedComponent: React.ComponentType) => {
    return (props: any) => (
        <QueryClientProvider client={queryClient}>
            {/* You can add any additional logic or components here */}
            <WrappedComponent {...props}/>
        </QueryClientProvider>
    );
};

export default withQueryClientProvider;