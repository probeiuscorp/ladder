import { StatArrow, StatHelpText } from '@chakra-ui/react';

export const ResultTicker = ({ change }: { change: number }) => (
    <StatHelpText>
        <StatArrow
            type={change >= 0 ? 'increase' : 'decrease'}
            filter={change === 0 ? 'saturate(0)' : ''}
        />
        {Math.abs(change)}
    </StatHelpText>
);