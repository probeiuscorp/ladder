import { race } from ':/lib/types';
import { Image, ImageProps } from '@chakra-ui/react';
import React from 'react';

export type RaceProps = {
    race: race,
    size?: string
} & ImageProps;

const icons: Record<race, string> = {
    terran: '/terran.svg',
    zerg: '/zerg.svg',
    protoss: '/protoss.svg'
};

export function Race({ race, size = '2.4rem', ...props }: RaceProps) {
    return (
        <Image
            src={icons[race]}
            filter="brightness(2)"
            boxSize={size}
            {...props}
        />
    );
}