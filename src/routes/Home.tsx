import { Button, Card, CardBody, Center, Flex, Heading, Icon, Input, InputGroup, InputLeftElement, Stack, useColorModeValue, useToast, VStack } from '@chakra-ui/react';
import { MdChatBubble } from 'react-icons/md'
import { AiOutlineUser } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ChatClientSocket } from '../types';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AppContext } from '../components/App';

interface Props {
    socket: ChatClientSocket;
}

const Home = ({ socket }: Props) => {
    const [nicknameInput, setNicknameInput] = useState('');
    const [navigateTo, setNavigateTo] = useState('');
    const { setNickname } = useContext(AppContext);
    const toast = useToast();
    const navigate = useNavigate();

    const joinChat = () => {
        if (nicknameInput.length === 0) return;

        socket.emit("setNickname", nicknameInput, response => {
           switch (response) {
                case "success":
                    setNickname(nicknameInput);
                    setNavigateTo('/chat');

                    break;

                case "unavailable":
                    toast({
                        title: `You can't use that nickname`,
                        description: "It is already in use",
                        status: 'error',
                        duration: 9000,
                        isClosable: true
                    });

                    break;
            }
        });
    };

    useEffect(() => {
        if (navigateTo.length > 0) navigate(navigateTo);
    }, [navigateTo]);

    return (
        <Center h='100vh'>
            <VStack
                position='relative'
            >
                <Flex
                    w='100%'
                    h='150px'
                    left='0px'
                    align='center'
                    bottom='100%'
                    position='absolute'
                    direction='column'
                >
                    <Icon flex={1} color={useColorModeValue('green.500', 'green.200')} boxSize='100%' as={MdChatBubble} />
                    <Heading flex={1} size='lg'>Chat with your friends!</Heading>
                </Flex>

                <Card w='lg'>
                    <CardBody>
                        <Stack spacing='3'>
                            <Flex gap='2' direction='row'>
                                <InputGroup>
                                    <InputLeftElement
                                        pointerEvents='none'
                                        children={<Icon as={AiOutlineUser} color={useColorModeValue('gray.400', 'gray.600')} />}
                                    />

                                    <Input
                                        flex={1}
                                        value={nicknameInput}
                                        onChange={e => setNicknameInput(e.target.value)}
                                        variant='filled'
                                        placeholder='Nickname'
                                        onKeyPress={e => e.key === "Enter" && joinChat()}
                                    />
                                </InputGroup>

                                <Button
                                    onClick={joinChat}
                                    colorScheme='green'
                                >
                                    Chat!
                                </Button>
                            </Flex>
                        </Stack>
                    </CardBody>
                </Card>
            </VStack>
        </Center>
    );
};

export default Home;
