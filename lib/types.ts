export type race = 'terran' | 'zerg' | 'protoss';
export const races: race[] = ['terran', 'zerg', 'protoss'];
export function isRace(string: string): string is race {
    return races.includes(string as race);
}

const matchups: Record<race | string, string> = {
    terran: 't',
    zerg: 'z',
    protoss: 'p',
    t: 'terran',
    z: 'zerg',
    p: 'protoss',
};
export function matchup(me: race, opponent: race) {
    return `${matchups[me]}v${matchups[opponent]}`;
}
export function racesForMatchup(string: string): [race, race] {
    const [shorthandMe, shortHandOpponent] = string.split('v');
    
    const me = matchups[shorthandMe];
    const opponent = matchups[shortHandOpponent];

    return [
        isRace(me) ? me : 'terran',
        isRace(opponent) ? opponent : 'terran'
    ]
}