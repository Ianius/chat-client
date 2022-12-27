import { Box, Center, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AppContext } from '../components/App';
import { Chatroom } from '../../../shared/types';
import { ChatClientSocket } from '../types';
import ChatSideBar from '../components/ChatSideBar';
import Chatbox from '../components/Chatbox';

interface Props {
    socket: ChatClientSocket;
}

const Chat = ({ socket }: Props) => {
    const navigate = useNavigate();
    const { nickname } = useContext(AppContext);
    const [chatrooms, setChatrooms] = useState<Array<Chatroom>>([]);
    const [currentChatroom, setCurrentChatroom] = useState<Chatroom>({ name: "No chatroom selected", description: "Select a chatroom to start chatting!"});

    const joinChatroom = (chatroom: Chatroom) => 
        socket.emit("joinChatroom", chatroom.name, () => setCurrentChatroom(chatroom));

    // If nickname is not valid, return to home page
    useEffect(() => { if (nickname.length === 0) navigate('/'); }, []);

    // Join room on first render
    useEffect(() => {
        socket.emit("getAllChatrooms", (response: Array<Chatroom>) => {
            setChatrooms(response);
            joinChatroom(response[0]);
        });
    }, []);

    if (nickname.length === 0) return null;

    return (
        <Center 
            w='100vw' 
            h='100vh'
        >
            <Box
                w='100%'
                h='100%'
                bg='blue.700'
                maxW='1600px'
                boxShadow='xl'
                overflow='hidden'
            >
                <Flex 
                    h='100%'
                    position='relative'
                >
                    <ChatSideBar 
                        nickname={nickname}
                        chatrooms={chatrooms}
                        currentChatroom={currentChatroom}
                        onChatroomSelected={joinChatroom}
                    />

                    <Chatbox 
                        socket={socket}
                        currentChatroom={currentChatroom}
                    />
                </Flex>
            </Box>
        </Center>
    );
};

export default Chat;
