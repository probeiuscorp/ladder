import { Mongo } from ':/lib/mongodb';
import { isRace, race } from ':/lib/types';
import { Page } from ':/view/Page'
import { Race } from ':/view/Race';
import { Flex, Heading, Stat, StatArrow, StatHelpText, Table, TableContainer, Tbody, Td, Text, Tr } from '@chakra-ui/react';
import { inspect } from 'util';

export type StatsProps = {
    wins: number,
    losses: number,
    change: number
}
export const Stats = ({ wins, losses, change }: StatsProps) => {
    return (
        <Flex gap={2}>
            <Text>
                {wins} - {losses}
            </Text>
            <Stat>
            <StatHelpText>
                <StatArrow
                    type={change >= 0 ? 'increase' : 'decrease'}
                    filter={change === 0 ? 'saturate(0)' : ''}
                />
                {Math.abs(change)}
            </StatHelpText>
            </Stat>
        </Flex>
    );
}

export type RaceHeaderProps = {
    race: race
};
export const RaceHeader = ({ race }: RaceHeaderProps) => {
    return (
        <Flex direction="column" alignItems="center">
            <Race race={race}/>
            {race}
        </Flex>
    );
}

export type PageInsightsProps = {
    week: Record<race | 'all', Record<race, StatsProps> & StatsProps>
}

export default function PageInsights({ week }: PageInsightsProps) {
    return (
        <Page minWidth="600px" width="revert">
            <Heading>Last week</Heading>
            <TableContainer overflow="visible">
                <Table>
                    <Tbody>
                        <Tr>
                            <Td fontFamily="Spectral">
                                vs →
                            </Td>
                            <Td>
                                All
                            </Td>
                            <Td>
                                <RaceHeader race="terran"/>
                            </Td>
                            <Td>
                                <RaceHeader race="zerg"/>
                            </Td>
                            <Td>
                                <RaceHeader race="protoss"/>
                            </Td>
                        </Tr>
                        {['all', 'terran', 'zerg', 'protoss'].map(race => (
                            <Tr key={race}>
                                <Td>
                                    {isRace(race)
                                        ? <RaceHeader race={race}/>
                                        : 'All'}
                                </Td>
                                <Td>
                                    <Stats {...week[race]}/>
                                </Td>
                                <Td>
                                    <Stats {...week[race].terran}/>
                                </Td>
                                <Td>
                                    <Stats {...week[race].zerg}/>
                                </Td>
                                <Td>
                                    <Stats {...week[race].protoss}/>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Page>
    );
}

const A_WEEK = 7 * 24 * 60 * 60 * 1e3;
export async function getServerSideProps(): Promise<{ props: PageInsightsProps }> {
    const mongo = await Mongo;
    const db = mongo.db('ladder').collection('probeiuscorp');

    const aggregate = await db.aggregate<{
        _id: {
            me: race,
            them: race
        },
        change: number,
        wins: number,
        losses: number,
    }>([
        {
            $match: {
                date: { $gt: new Date(Date.now() - A_WEEK) }
            }
        },
        {
            $group: {
                _id: {
                    me: '$me',
                    them: '$them'
                },
                change: { $sum: '$change' },
                wins: { $sum: '$isWin' },
                losses: { $sum: '$isLoss' },
            }
        }
    ]).toArray();

    // high quality code too
    const bare: StatsProps = { change: 0, wins: 0, losses: 0 };
    const week: PageInsightsProps['week'] = {
        all: {
            ...bare,
            terran: { ...bare },
            zerg: { ...bare },
            protoss: { ...bare },
        },
        terran: {
            ...bare,
            terran: { ...bare },
            zerg: { ...bare },
            protoss: { ...bare },
        },
        zerg: {
            ...bare,
            terran: { ...bare },
            zerg: { ...bare },
            protoss: { ...bare },
        },
        protoss: {
            ...bare,
            terran: { ...bare },
            zerg: { ...bare },
            protoss: { ...bare },
        },
    };
    for(const { _id: { me, them }, ...stats } of aggregate) {
        week.all.change += stats.change;
        week.all.losses += stats.losses;
        week.all.wins += stats.wins;

        const their = week.all[them];
        their.change += stats.change;
        their.losses += stats.losses;
        their.wins += stats.wins;
        
        const entry = week[me];
        entry.change += stats.change;
        entry.losses += stats.losses;
        entry.wins += stats.wins;
        entry[them] = stats;
    }

    return {
        props: { week }
    };
}