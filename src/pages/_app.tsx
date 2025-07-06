import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { AuthProvider } from "@/componets/Auth/AuthProvider";
import React from 'react';
import "@/styles/globals.css";

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <Provider store={store}>
            <AuthProvider>
                <Component {...pageProps} />
            </AuthProvider>
        </Provider>
    );
};

export default App
;