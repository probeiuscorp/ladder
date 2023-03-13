import ':/styles/globals.css';
import { ChakraProvider, extendTheme, type localStorageManager } from '@chakra-ui/react';

const theme = extendTheme({
    config: {
        initialColorMode: 'dark',
        useSystemColorMode: false,
    },
    fonts: {
        heading: 'GT Pressura Mono',
        body: 'Open Sans',
        
    }
});

const justMakeItDarkThemeMan: typeof localStorageManager = {
    type: 'localStorage',
    get: () => 'dark',
    set: () => {},
    ssr: false
}

export default function MyApp({ Component, pageProps }) {
    return (
        <ChakraProvider theme={theme} resetCSS colorModeManager={justMakeItDarkThemeMan}>
            <Component {...pageProps} />
        </ChakraProvider>
    );
}