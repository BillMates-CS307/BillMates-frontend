import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export default async function handler(req, res) {

    if (req.method !== "POST")  {
        return res.status(405).end(`Method : ${req.method} not allowed`);
    }

    const {email, password} = JSON.parse(req.body);

    const token = jwt.sign({ sub: email}, serverRuntimeConfig.JWT_TOKEN, { expiresIn: '7d' });

    return res.status(200).json({key : serverRuntimeConfig.JWT_TOKEN});
}