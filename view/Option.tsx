import { Box } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { OptionContext, useOptionsDescendant } from './Options';

export type OptionProps = React.PropsWithChildren<{
    icon: React.ReactNode
    onClick?(): void;
}>;

export function Option({ icon, children, onClick }: OptionProps) {
    const { index, register } = useOptionsDescendant();
    const selected = useContext(OptionContext);
    const isActive = index === selected;

    return (
        <Box
            bg="blackAlpha.700"
            borderRadius="md"
            textAlign="center"
            fontFamily="heading"
            boxShadow={isActive ? "outline" : undefined}
            ref={register}
            onClick={onClick}
        >
            <Box p={5} pb={1}>
                {icon}
            </Box>
            <Box
                fontSize="xl"
                pb={5}
            >
                {children}
            </Box>
        </Box>
    );
}