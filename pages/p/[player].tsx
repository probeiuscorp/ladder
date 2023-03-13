import { matchup, race, races } from ':/lib/types';
import { Option } from ':/view/Option';
import { Options } from ':/view/Options';
import { Page } from ':/view/Page';
import { Race } from ':/view/Race';
import { Center } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PagePlayer() {
    const player = useRouter().query.player as string;
    const [me, setMe] = useState(0);
    const [opponent, setOpponent] = useState(0);
    const [isEnteringMe, setIsEnteringMe] = useState(true);
    const router = useRouter();

    const go = (me: race, opponent: race) => {
        router.push(`/p/${player}/${matchup(me, opponent)}`);
    }

    // the most incredible spaghetti handler ever
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const setActiveRace = isEnteringMe ? setMe : setOpponent;

            if(e.key === 'ArrowLeft') {
                setMe(selected => Math.max(selected - 1, 0));
            } else if(e.key === 'ArrowRight') {
                setMe(selected => Math.min(selected + 1, 2));
            } else if(e.key === 'ArrowUp') {
                setOpponent(selected => Math.max(selected - 1, 0));
            } else if(e.key === 'ArrowDown') {
                setOpponent(selected => Math.min(selected + 1, 2));
            } else if(e.key === 'Enter') {
                go(races[me], races[opponent]);
            } else if(e.key === 't') {
                setActiveRace(0);
                setIsEnteringMe(isEnteringMe => !isEnteringMe);
            } else if(e.key === 'z') {
                setActiveRace(1)
                setIsEnteringMe(isEnteringMe => !isEnteringMe);
            } else if(e.key === 'p') {
                setActiveRace(2);
                setIsEnteringMe(isEnteringMe => !isEnteringMe);
            } else if(e.key === 'Escape') {
                setIsEnteringMe(true);
            }
        }
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [me, opponent, isEnteringMe]);

    return (
        <Page title="Ladder">
            <Options selected={me}>
                {races.map(race => (
                    <Option icon={<Race race={race} size="5rem"/>} key={race}>
                        {race}
                    </Option>
                ))}
            </Options>
            <Center fontFamily="Spectral" fontSize="x-large">
                vs
            </Center>
            <Options selected={opponent}>
                {races.map(race => (
                    <Option icon={<Race race={race} size="5rem"/>} key={race}>
                        {race}
                    </Option>
                ))}
            </Options>
        </Page>
    )
}
