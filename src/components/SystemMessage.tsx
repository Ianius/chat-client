import { Flex } from '@chakra-ui/react';

interface Props {
    message: string;
}

const SystemMessage = ({ message }: Props) => (
    <Flex
		w='100%'
        align='center'
        justify='center'
    >
        <Flex
            p='12px'
            bg='blue.200'
            color='blue.800'
            rounded='lg'
        >
            {message}
        </Flex>
    </Flex>
);

export default SystemMessage;
