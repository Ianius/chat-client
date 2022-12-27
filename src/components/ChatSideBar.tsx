import { useBoolean, useBreakpointValue } from '@chakra-ui/react';
import { Avatar, Box, Flex, HStack, Icon, Stack, Text, VStack } from "@chakra-ui/react";
import { Chatroom } from '../../../shared/types';
import { useState } from 'react';
import { BsChatSquareDots } from 'react-icons/bs'
import { IoIosArrowBack } from 'react-icons/io';

interface ChatroomButtonProps {
    target: Chatroom;
    selected: Chatroom;
    onClick: (chatroom: Chatroom) => void;
}

const ChatroomButton = ({ target, selected, onClick }: ChatroomButtonProps) => {
    const [hovered, setHovered] = useState(false);

    return (
        <Box
            p='4'
            bg={
                (selected.name === target.name)
                    ? 'rgba(255, 255, 255, 0.1)'
                    : hovered
                        ? 'rgba(255, 255, 255, 0.2)'
                        : ''
            }
	    cursor='pointer'
            onClick={() => onClick(target)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Text>{target.name}</Text>
        </Box>
    );
};

interface Props {
    nickname: string;
    chatrooms: Chatroom[];
    currentChatroom: Chatroom;
    onChatroomSelected: (chatroom: Chatroom) => void;
}

const ChatSideBar = ({ nickname, chatrooms, currentChatroom, onChatroomSelected }: Props) => {
    const [enabled, setEnabled] = useBoolean(true);

    const smallScreen = useBreakpointValue({ base: true, md: false }, { ssr: false });

    return (
        <>
            { /* 
                This <Box> is a fake invisible bar used to occupy the space of the real bar,
                the real bar has position='absolute' and it's animated using transform='translateX()',
                while this fake bar animates the width.

                This is because if you animate the width of the real bar, the text gets all messed up.
            */ }
            <Box
                h='100%'
                w='300px'
                maxW={enabled ? '300px' : '0px'}
                position={smallScreen ? 'absolute' : undefined}
                transition='100ms'
                pointerEvents='none'
            >
                <Icon
                    as={IoIosArrowBack}
                    position='absolute'
                    transform={enabled ? "rotate(0deg)" : "rotate(180deg)"}
                    transition='100ms'
                    boxSize='40px'
                    color='gray.400'
                    cursor='pointer'
                    left='0px'
                    pointerEvents='all'
                    top='0px'
                    bottom='0px'
                    my='auto'
                    onClick={setEnabled.toggle}
                    zIndex='1001'
                    _hover={{ color: "gray.200" }}
                />
            </Box>

            { /* REAL BAR */}
            <Box
                h='100%'
                w='300px'
                bg='blue.600'
                position={'absolute'}
                transform={`translateX(${enabled ? '0' : '-100%'})`}
                transition='100ms'
                zIndex='1000'
            >
                <Flex
                    h='100%'
                    direction='column'
                    position='relative'
                >
                    <HStack
                        p='4'
                        gap={4}
                    >
                        <Avatar name={nickname} size='xl' />

                        <VStack
                            h='80%'
                            spacing={0}
                            align='start'
                        >
                            <Text>{nickname}</Text>
                            <Text my='0px' color='green.300'>&bull; Online</Text>
                        </VStack>
                    </HStack>

                    <Stack
                        flex={1}
                        spacing='0'
                    >
                        <HStack
                            p='4'
                        >
                            <Icon as={BsChatSquareDots} />
                            <Text>Chatrooms</Text>
                        </HStack>

                        {chatrooms.map(chatroom =>
                            <ChatroomButton
                                key={chatroom.name}
                                target={chatroom}
                                selected={currentChatroom}
                                onClick={onChatroomSelected}
                            />)}
                    </Stack>
                </Flex>
            </Box>

        </>
    );
}

export default ChatSideBar;
