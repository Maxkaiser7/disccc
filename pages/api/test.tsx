import {NextApiRequest, NextApiResponse} from "next";

export default function (res: NextApiResponse, req: NextApiRequest) {
    try {
        res.status(200).json({done:"ok"});
    } catch (err) {
        res.status(500).json({error:err});
    }
}