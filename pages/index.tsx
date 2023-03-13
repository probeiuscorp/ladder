import React, { useEffect, useState } from 'react';
import { Page } from ':/view/Page';
import { Box, Input, Spinner, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [value, setValue] = useState('');
    const [data, setData] = useState<string[] | null>(null);
    const [selected, setSelected] = useState<string | null>();

    const handlePicked = (player: string) => {
        router.push(`/p/${player}`);
    }

    useEffect(() => {
        if(value === '') {
            setData(null);
            setIsLoading(false);
        } else {
            const signal = new AbortController();
            setIsLoading(true);

            // poor man's throttle:
            const timeout = setTimeout(() => {
                fetch(`/api/lookup?search=${value}`, { signal: signal.signal })
                    .then(res => res.json())
                    .then(({ players }) => {
                        setData([value, ...players]);
                        setIsLoading(false);
                    })
                    .catch(() => {});
            }, 400);
    
            return () => {
                signal.abort();
                clearInterval(timeout);
            };
        }
    }, [value]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if(e.key === 'ArrowDown') {
                if(selected) {
                    const i = data.indexOf(selected);
                    if(i !== -1) {
                        setSelected(data[Math.min(data.length, i + 1)]);
                        return;
                    }
                }
                setSelected(data[0]);
            } else if(e.key === 'ArrowUp') {
                if(selected) {
                    const i = data.indexOf(selected);
                    if(i !== -1) {
                        setSelected(data[Math.max(0, i - 1)]);
                        return;
                    }
                }
                setSelected(data[data.length - 1]);
            } else if(e.key === 'Enter') {
                handlePicked(selected ?? value);
            }
        }
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [selected, data]);

    return (
        <Page>
            <Input
                value={value}
                onChange={e => setValue(e.target.value)}
                autoFocus
            />
            {data === null
                ? (
                    isLoading
                        ? <Spinner/>
                        : null
                )
                : (
                    <VStack
                        width="100%"
                        gap={0.25}
                        opacity={isLoading ? 0.5 : 1}
                        alignItems="stretch"
                    >
                        {data.map(player => (
                            <Box
                                onClick={() => handlePicked(player)}
                                p={1.5}
                                pl={3}
                                mt={0}
                                bg={selected === player ? "gray.600" : "gray.700"}
                                borderRadius="sm"
                                key={player}
                            >
                                {player}
                            </Box>
                        ))}
                    </VStack>
                )}
        </Page>
    );
}
