import React from 'react';
import { createRoot } from 'react-dom/client';
// We need Provider for isolation mode, but we avoid importing Redux/Provider here
// to prevent synchronous loading issues in federated mode.

// The mount function handles rendering. It must dynamically import the main component
// to create an asynchronous boundary. This ensures shared dependencies (like React)
// are loaded by the Module Federation runtime before the component tries to use them.
const mount = (el) => {
    import('./CreditCardMFE.jsx').then(({ default: CreditCardMFE }) => {
        const root = createRoot(el);
        // When mounted by the host, the component will inherit the host's Provider, 
        // so we just render the MFE component directly here.
        root.render(<CreditCardMFE />);
    });
};

// If running in isolation (for development), mount immediately
// CRITICAL FIX: We must wrap the MFE in a local Redux Provider when running standalone.
if (document.getElementById('root')) {
    // Dynamically import the component, Provider, and a local store for isolation.
    // NOTE: You must create a file at ./src/store.js in this project 
    // that mocks the main Redux store/reducer structure.
    Promise.all([
        import('react-redux'),
        import('./CreditCardMFE.jsx'),
        import('./store.js')
    ]).then(([
        { Provider }, 
        { default: CreditCardMFE }, 
        { store }
    ]) => {
        const root = createRoot(document.getElementById('root'));
        root.render(
            <Provider store={store}>
                <CreditCardMFE />
            </Provider>
        );
    });
}

export { mount };
