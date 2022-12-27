import { Box } from "@chakra-ui/react";
import { Outlet } from 'react-router-dom';
import { createContext } from "react";
import ColorModeToggle from "./ColorModeToggle";
import { useState } from "react";

interface AppContextData {
    nickname: string;
    setNickname: (nickname: string) => void;
}

export const AppContext = createContext<AppContextData>({ nickname: "", setNickname: _ => null });

const App = () => {
    const [nickname, setNickname] = useState("");

    return (
        <AppContext.Provider value={{ nickname, setNickname }}>
            <Box>
                <ColorModeToggle />
                <Outlet />
            </Box>
        </AppContext.Provider>
    );
};

export default App;