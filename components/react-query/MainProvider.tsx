import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Create a new instance of QueryClient
const queryClient = new QueryClient();

// Define the HOC
const withQueryClientProvider = (WrappedComponent: React.ComponentType) => {
    const WithQueryClientProvider = (props: any) => (
        <QueryClientProvider client={queryClient}>
            {/* You can add any additional logic or components here */}
            <WrappedComponent {...props} />
        </QueryClientProvider>
    );

    // Set the display name for the HOC
    WithQueryClientProvider.displayName = `WithQueryClientProvider(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return WithQueryClientProvider;
};

export default withQueryClientProvider;