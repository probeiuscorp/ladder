import React from 'react';
import NextLink from 'next/link';
import { Link as ChakraLink, LinkProps as ChakraLinkProps } from '@chakra-ui/react';

export type LinkProps = ChakraLinkProps;

export function Link(props: LinkProps) {
    return (
        <ChakraLink as={NextLink} {...props}>
            {props.children}
        </ChakraLink>
    )
}