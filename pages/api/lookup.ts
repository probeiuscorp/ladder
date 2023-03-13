import { Mongo } from ':/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export type PlayerResponse = {
    players: string[]
} | void;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<PlayerResponse>
) {
    if(req.method !== 'GET') {
        res.status(505).send();
        return;
    }

    const search = req.query.search;
    if(typeof search !== 'string' || search === '') {
        res.status(400).send();
        return;
    }

    const mongo = await Mongo;
    const db = mongo.db('ladder').collection('probeiuscorp');
    const players = await db.distinct('name', {
        name: {
            $regex: search,
            $options: 'i'
        }
    });

    res.send({ players });
}