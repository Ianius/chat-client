import { Box, Center, Divider, Flex, HStack, Icon, IconButton, Input, Text, VStack } from "@chakra-ui/react";
import { AiOutlineUser } from "react-icons/ai";
import { RiSendPlane2Fill } from "react-icons/ri";
import { SlArrowDown } from "react-icons/sl";
import { Chatroom } from '../../../shared/types';
import { useContext, useLayoutEffect, useRef } from 'react';
import { AppContext } from '../components/App';
import { MessageData } from '../types';
import { useState, useEffect } from 'react';
import { ChatClientSocket } from '../types';
import SystemMessage from "./SystemMessage";
import Message from "./Message";

interface Props {
    socket: ChatClientSocket;
    currentChatroom: Chatroom;
}

const Chatbox = ({ socket, currentChatroom }: Props) => {
    const messageBoxRef = useRef<HTMLDivElement>(null);
    const { nickname } = useContext(AppContext);
    const [isScrollEnd, setIsScrollEnd] = useState(true);
    const [messages, setMessages] = useState<Map<string, Array<MessageData>>>(new Map());
    const [messageInput, setMessageInput] = useState('');
    const [usersInChatroom, setUsersInChatroom] = useState<string[]>([]);

    const scrollToBottom = () => {
        messageBoxRef.current?.scrollTo({ top: messageBoxRef.current?.scrollHeight ?? 0 });
        setIsScrollEnd(true);
    };

    const addMessage = (nickname: string, message: string, system: boolean = false) => {
        const time = new Date();
        const newMessages = new Map(messages);
        const prevChatroomMessages = newMessages.get(currentChatroom.name) ?? [];
        const newChatroomMessages = [...prevChatroomMessages, { time, system, nickname, message }];

        newMessages.set(currentChatroom.name, newChatroomMessages);

        setMessages(newMessages);
    };

    const sendMessage = () => { 
        setMessageInput(''); 
        socket.emit("sendMessage", messageInput, () => addMessage(nickname, messageInput)); 
    };

    // Receive messages
    useEffect(() => {
        socket.on("messageSent", (nickname, message) => addMessage(nickname, message));
        return () => { socket.off("messageSent"); }
    }, [currentChatroom, messages]);

    // Change connected users
    useEffect(() => {
        socket.emit("getUsersInChatroom", users => setUsersInChatroom(users));
    }, [usersInChatroom]);

    // Connect all events
    useEffect(() => {
        socket.on("userJoinedChatroom", nickname => {
            setUsersInChatroom([...usersInChatroom, nickname]);
            addMessage("", `User ${nickname} joined the chatroom!`, true);
        });

        socket.on("userLeftChatroom", nickname => {
            setUsersInChatroom(usersInChatroom.filter(u => u !== nickname))
            addMessage("", `User ${nickname} left the chatroom!`, true);
        });

        return () => {
            socket.off("userJoinedChatroom");
            socket.off("userLeftChatroom");
        };
    }, [messages, usersInChatroom]);

    useEffect(() => {
        const messageBox = messageBoxRef.current;

        const onScroll = () => {
            const scrollHeight = messageBox?.scrollHeight ?? 0;
            const scrollTop = messageBox?.scrollTop ?? 0;
            const isAtEnd = 
                (scrollHeight - scrollTop) === messageBox?.clientHeight;

            if (isAtEnd !== isScrollEnd) setIsScrollEnd(isAtEnd);
        };

        messageBox?.removeEventListener('scroll', onScroll);
        messageBox?.addEventListener('scroll', onScroll);

        return () => messageBox?.removeEventListener('scroll', onScroll);
    }, [isScrollEnd]);

    // Scroll to bottom on new message added or chatroom changed
    useLayoutEffect(scrollToBottom, [messages, currentChatroom]);

    return (
        <VStack
            flex={4}
            align='left'
            spacing={0}
            position='relative'
        >
            <HStack
                p='4'
            >
                <VStack
                    flex={1}
                    align='start'
                >
                    <Text fontWeight='semibold'>{currentChatroom.name}</Text>
                    <Text color='gray.300'>{currentChatroom.description}</Text>
                </VStack>

                <HStack
                    flex={1}
                    justify='end'
                >
                    <Text>{usersInChatroom.length}</Text>
                    <Icon as={AiOutlineUser} />
                </HStack>
            </HStack>

            <Divider />

            { /* CHATBOX */ }
            <Box
                flex={1}
                position='relative'
                overflow='hidden'
            >
                <VStack
                    ref={messageBoxRef}
                    px='56px'
                    py='16px'
                    maxH='100%'
                    overflowY='scroll'
                    spacing='4px'
                    css={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(255, 255, 255, .2) transparent',
                    }}
                >
                    <SystemMessage message={`Hello ${nickname}, Welcome to the ${currentChatroom.name} chatroom!`} />

                    {messages.has(currentChatroom.name) &&
                        messages.get(currentChatroom.name)!.map((data, i, arr) =>
                            data.system 
                                ? <SystemMessage key={i} message={data.message} />
                                : <Message
                                    key={i}
                                    time={data.time}
                                    nickname={i > 0 ? (arr[i - 1].nickname !== data.nickname ? data.nickname : undefined) : data.nickname}
                                    text={data.message}
                                    side={data.nickname === nickname ? 'right' : 'left'}
                                    tail={i > 0 && arr[i - 1].nickname === data.nickname ? false : true}
                                    />
                    )}
                </VStack>

                <Center
                    w='40px'
                    h='40px'
                    position='absolute'
                    bottom='16px'
                    right='16px'
                >
                    <Center
                        bg='gray.700'
                        cursor='pointer'
                        opacity={isScrollEnd ? '0' : '1'}
                        boxSize={isScrollEnd ? '0px' : '100%'}
                        rounded='full'
                        transition='250ms'
                        onClick={scrollToBottom}
                        _hover={{ bg: 'gray.600' }}
                    >
                        <Icon color='gray.400' boxSize='40%' as={SlArrowDown} />
                    </Center>
                </Center>
            </Box>

            <Box
                p='4'
                bg='blue.900'
            >
                <Flex gap='2' direction='row'>
                    <Input
                        bg='rgba(255, 255, 255, 0.05)'
                        flex={1}
                        value={messageInput}
                        onChange={e => setMessageInput(e.target.value)}
                        variant='filled'
                        placeholder='Type a message'
                        onKeyPress={e => e.key === "Enter" && sendMessage()}
                        focusBorderColor='transparent'
                        _focus={{ bg: 'rgba(255, 255, 255, 0.05)' }}
                        />

                    <IconButton
                        icon={<Icon as={RiSendPlane2Fill} />}
                        variant='ghost'
                        aria-label='send'
                        // onClick={onChatButtonClicked}
                        colorScheme='green'
                        fontSize='20px'
                        onClick={sendMessage}
                        />
                </Flex>
            </Box>
        </VStack>
    );
};

export default Chatbox;
