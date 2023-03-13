import { Center, Flex, VStack } from '@chakra-ui/react';
import Head from 'next/head';
import React from 'react';
import { Link } from './Link';

export type PageProps = {
    title?: string
    className?: string,
}

export function Page({ title = 'Ladder', children }: React.PropsWithChildren<PageProps>) {
    return (
        <main>
            <Head>
                <title>{title}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Center m="2">
                <VStack width="600px">
                    <Flex gap={1.5} fontSize="smaller">
                        <Link href="/">lookup</Link>
                    </Flex>
                    {children}
                </VStack>
            </Center>
        </main>
    )
}