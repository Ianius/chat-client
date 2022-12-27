import { extendTheme, type StyleFunctionProps } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools'

const theme = extendTheme({ 
    config: {
        initialColorMode: 'light',
        useSystemColorMode: false,
    },

    colors: {
        darkBg: "#0e1726",
        lightBg: "#ffffff"
    },

    styles: {
        global: (props: StyleFunctionProps) => ({
            body: {
                bg: mode('lightBg', 'darkBg')(props),
                color: mode('black', 'white')(props),
            }
        })
    }
});

export default theme;