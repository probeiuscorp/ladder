import { createDescendantContext } from '@chakra-ui/descendant';
import { ChakraProps, Flex, FlexboxProps } from '@chakra-ui/react';
import React from 'react';

const [
    DescendantsProvider,
    ,
    useDescendants,
    useDescendant
] = createDescendantContext();

export const useOptionsDescendant = useDescendant;
export const useOptionsDescendants = useDescendants;
export const OptionContext = React.createContext(0);

export type OptionsProps = React.PropsWithChildren<{
    selected: number
}> & FlexboxProps & ChakraProps;

export function Options({ selected, children, ...props }: OptionsProps) {
    const descendants = useDescendants();

    return (
        <Flex gap={1.5} {...props}>
            <DescendantsProvider value={descendants}>
                <OptionContext.Provider value={selected}>
                    {children}
                </OptionContext.Provider>
            </DescendantsProvider>
        </Flex>
    );
}