import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { io } from 'socket.io-client';
import { ChatClientSocket } from './interfaces';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import Chat from './routes/Chat';
import Home from './routes/Home';
import theme from './theme';

const ENDPOINT = 'https://chat-server-3bed.onrender.com';

const socket: ChatClientSocket = io(ENDPOINT);
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<App />}>
        <Route index element={<Home socket={socket} />} />
        <Route path="/chat" element={<Chat socket={socket}/>} />
    </Route>
));

root.render(
    <React.StrictMode>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider theme={theme}>
            <RouterProvider router={router} />
        </ChakraProvider>
    </React.StrictMode>
);