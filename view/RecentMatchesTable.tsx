import React from 'react';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { ResultTicker } from './ResultTicker';
import { Stat, Table, Tbody, Td, Tr } from '@chakra-ui/react';
import { Filter } from 'mongodb';

export interface RecentMatch {
    build: string,
    change: number,
    date: number
};

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');
export interface RecentMatchesTableProps {
    now: number;
    recentMatches: RecentMatch[];
}
export function RecentMatchesTable({ recentMatches, now = Date.now() }: RecentMatchesTableProps) {
    return (
        <Table size="sm">
            <Tbody>
                {recentMatches.map(({ date, build, change }, i) => (
                    <Tr key={i}>
                        <Td>
                            <Stat size="sm">
                                <ResultTicker change={change}/>
                            </Stat>
                        </Td>
                        <Td width="2500px" whiteSpace="break-spaces">
                            {build}
                        </Td>
                        <Td>
                            {timeAgo.format(date, 'twitter', { now })}
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    )
}