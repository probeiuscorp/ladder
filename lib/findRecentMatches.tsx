import { Mongo } from ':/lib/mongodb';
import { RecentMatch } from '../view/RecentMatchesTable';

export async function findRecentMatches({
    player, filter = {}, limit = 12,
}: {
    player: string;
    filter?: object;
    limit?: number;
}): Promise<RecentMatch[]> {
    const mongo = await Mongo;
    const db = mongo.db('ladder').collection('probeiuscorp');
    const recentMatches = await db.find({
        name: {
            $regex: `^${player}$`,
            $options: 'i'
        },
        ...filter
    }).limit(limit).sort({
        date: -1
    }).project<{ date: Date; build: string; change: number; }>({
        _id: 0,
        date: 1,
        build: 1,
        change: 1
    }).toArray();
    return recentMatches.map(({ date, ...match }) => ({
        date: date.valueOf(),
        ...match
    }));
}
