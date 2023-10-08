import { Mongo } from ':/lib/mongodb';
import { races } from ':/lib/types';
import { attempt } from ':/lib/util';
import { NextApiRequest, NextApiResponse } from 'next';
import * as Yup from 'yup';

const SubmitSchema = Yup.object({
    name: Yup.string().required(),
    their: Yup.string().required(),
    mine: Yup.string().required(),
    why: Yup.string().required(),
    me: Yup.string().oneOf(races).required(),
    them: Yup.string().oneOf(races).required(),
    change: Yup.number().required()
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ success: boolean, why?: string }>
) {
    if(req.method !== 'POST') {
        res.status(405).send({ success: false });
        return;
    }

    const [err, match] = await attempt(() => SubmitSchema.validate(req.body));
    if(err) {
        res.status(400).send({
            success: false,
            why: err instanceof Yup.ValidationError
                ? err.message
                : 'Invalid request'
        });
        return;
    }

    const { name, their, mine, change, why, me, them } = match;
    const mongo = await Mongo;
    const db = mongo.db('ladder').collection('probeiuscorp');
    
    await db.insertOne({
        name,
        build: their,
        myBuild: mine,
        why,
        me,
        them,
        change,
        isWin: change > 0 ? 1 : 0,
        isLoss: change < 0 ? 1 : 0,
        isTie: change === 0 ? 1 : 0,
        date: new Date()
    });
    
    res.send({
        success: true
    });
}