import { race, racesForMatchup } from ':/lib/types';
import { Page } from ':/view/Page';
import { SubmitMatchForm } from ':/view/SubmitMatchForm';
import { Alert, AlertIcon, AlertTitle, Center, Flex, Heading, HStack, IconButton, Image, Spacer, Stat, StatArrow, StatHelpText, StatNumber, Table, TableContainer, Tbody, Td, Text, Tr } from '@chakra-ui/react';
import React from 'react';
import { Race } from ':/view/Race';
import { NextPageContext } from 'next';
import { Mongo } from ':/lib/mongodb';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

const ResultTicker = ({ change }: { change: number }) => (
    <StatHelpText>
        <StatArrow
            type={change >= 0 ? 'increase' : 'decrease'}
            filter={change === 0 ? 'saturate(0)' : ''}
        />
        {Math.abs(change)}
    </StatHelpText>
);

export type PageAccountProps = {
    data: {
        name: string,
        me: race,
        them: race,
        beaten: number,
        losses: number,
        net: number,
        builds: {
            beaten: number,
            losses: number,
            net: number,
            description: string
        }[],
        recentMatches: {
            build: string,
            change: number,
            date: number
        }[]
    }
}

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

export default function PageAccount({ data }: PageAccountProps) {
    return (
        <Page title={`${data.name} | Ladder`}>
            <HStack>
                <Race race={data.me}/>
                <Center fontFamily="Spectral" pl={1.5} pr={1.5}>
                    VS
                </Center>
                <Race race={data.them}/>
                <Heading>
                    {data.name}
                </Heading>
            </HStack>
            <Flex gap={2}>
                <Text>
                    {data.beaten} - {data.losses}
                </Text>
                <Stat>
                    <ResultTicker change={data.net}/>
                </Stat>
            </Flex>
            {data.builds.length > 0 ?
                (
                    <TableContainer width="100%">
                        <Heading size="xs">Builds</Heading>
                        <Table size="sm">
                            <Tbody>
                                {data.builds.map((build, i) => (
                                    <Tr key={build.description}>
                                        <Td>
                                            <Text fontSize="xl" fontFamily="Manrope">
                                                {i + 1}
                                            </Text>
                                        </Td>
                                        <Td pl={0} pr={0} pb={0}>
                                            <Stat size="sm">
                                                <StatNumber>{build.beaten} - {build.losses}</StatNumber>
                                                <ResultTicker change={build.net}/>
                                            </Stat>
                                        </Td>
                                        <Td width="2500px">
                                            {build.description}
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Alert status="warning">
                        <AlertIcon/>
                        <AlertTitle>No build orders</AlertTitle>
                    </Alert>
                )}
            <Spacer/>
            <SubmitMatchForm data={data}/>
            <Spacer/>
            {data.recentMatches.length > 0
                ? (
                    <TableContainer width="100%">
                        <Heading size="xs">Recent matches</Heading>
                        <Table size="sm">
                            <Tbody>
                                {data.recentMatches.map(({ date, build, change }, i) => (
                                    <Tr key={i}>
                                        <Td>
                                            <Stat size="sm">
                                                <ResultTicker change={change}/>
                                            </Stat>
                                        </Td>
                                        <Td width="2500px">
                                            {build}
                                        </Td>
                                        <Td>
                                            {timeAgo.format(date, 'twitter')}
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                )
                : (
                    <Alert status="warning">
                        <AlertIcon/>
                        <AlertTitle>No recent matches</AlertTitle>
                    </Alert>
                )}
        </Page>
    );
}

export async function getServerSideProps(ctx: NextPageContext): Promise<{ props: PageAccountProps }> {
    const player = ctx.query.player as string;
    const matchup = ctx.query.matchup as string;
    const [me, them] = racesForMatchup(matchup);

    const mongo = await Mongo;
    const db = mongo.db('ladder').collection('probeiuscorp');
    
    // there probably is a smart way to do both of these in one aggregate
    const [builds, recentMatches] = await Promise.all([
        db.aggregate<{
            _id: string,
            beaten: number,
            losses: number,
            net: number
        }>([
            {
                $match: {
                    name: {
                        $regex: `^${player}$`,
                        $options: 'i'
                    },
                    me,
                    them
                }
            }, {
                $group: {
                    _id: '$build',
                    beaten: {
                        $sum: '$isWin'
                    },
                    losses: {
                        $sum: '$isLoss'
                    },
                    net: {
                        $sum: '$change'
                    },
                    n: {
                        $count: {}
                    }
                }
            }, {
                $sort: {
                    n: -1,
                    _id: 1
                }
            }
        ]).toArray(),
        db.find({
            name: {
                $regex: `^${player}$`,
                $options: 'i'
            },
            me,
            them
        }).limit(12).sort({
            date: -1
        }).project<{ date: Date, build: string, change: number }>({
            _id: 0,
            date: 1,
            build: 1,
            change: 1
        }).toArray(),
    ]);

    // high tier stuff
    const { beaten, losses, net } = builds.reduce((stats, build) => ({
        beaten: stats.beaten + build.beaten,
        losses: stats.losses + build.losses,
        net: stats.net + build.net
    }), { beaten: 0, losses: 0, net: 0 })

    return {
        props: {
            data: {
                name: player,
                me,
                them,
                beaten,
                losses,
                net,
                builds: builds.map(({ _id, ...build }) => ({ ...build, description: _id })),
                recentMatches: recentMatches.map(({ date, ...match }) => ({ ...match, date: date.valueOf() }))
            }
        }
    };
};