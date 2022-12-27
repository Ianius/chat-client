import { Icon } from '@chakra-ui/react';

interface Props {
	side: 'left' | 'right';
}

const MessageTail = ({ side }: Props) => (
    <Icon
        viewBox='0 0 100 100'
        color='blue.300'
        right={side === 'left' ? '100%' : undefined}
        left={side === 'left' ? undefined : '100%'}
        top='0px'
        position='absolute'
        transform={`scale(${side === 'left' ? 1 : -1}, 1)`}
        w='8px'
        h='8px'
    >
        <polygon fill='currentColor' points='100 100, 100 0, 0 0'/>
    </Icon>
);

export default MessageTail;