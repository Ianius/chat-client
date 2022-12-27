import { Text, Box, Flex, VStack, Avatar } from '@chakra-ui/react';
import { useState } from 'react';
import MessageTail from './MessageTail';

interface Props {
    time: Date;
    nickname?: string;
    text: string;
    side: 'left' | 'right';
    tail?: boolean;
}

const Message = ({ time, nickname, text, side, tail }: Props) => {
    const formattedTime = time.toLocaleTimeString('default', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <Flex
            w='100%'
            align={side === 'left' ? 'start' : 'end'}
            justify='center'
            direction='column'
        >
            <Flex
                p='0.5em'
                bg='blue.300'
                position='relative'
                rounded={tail ? undefined : 'lg'}
                roundedLeft={side === 'right' ? 'lg' : undefined}
                roundedRight={side === 'left' ? 'lg' : undefined}
                roundedBottom='lg'
            >
                {tail && <MessageTail side={side} />}

                {nickname && 
                    <Avatar
                        name={nickname}
                        size='sm'
                        position='absolute'
                        right={side === 'left' ? 'calc(100% + 8px)' : undefined}
                        left={side === 'right' ? 'calc(100% + 8px)' : undefined}
                        top='0px'
                    />
                }

                <VStack
                    spacing='0px'
                    p='0px'
                    m='0px'
                    gap='0px'
                    align='start'
                >
                    <Text color='blue.800'>{nickname}</Text>
                    <Text>{text}</Text>
                </VStack>

                <Flex
                    ml='8px'
                    align='end'
                    justify='end'
                    fontSize='xs'
                    color='gray.200'
                >
                    {formattedTime}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Message;
