import { Button, Text, useColorMode } from "@chakra-ui/react";

const ColorModeToggle = () => {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Button
            position='absolute'
            top='10px'
            right='10px'
            onClick={toggleColorMode}
        >
            <Text>
                {colorMode}
            </Text>
        </Button>

    );
};

export default ColorModeToggle;