import type { NextApiRequest, NextApiResponse } from 'next';

export default async function POST(request: NextApiRequest, response: NextApiResponse) {
	try {
		const body = request.body;
		const admin_username = process.env.ADMIN_USER;
		const admin_password = process.env.ADMIN_PASS;
		const { username, password } = body;
		if (username === admin_username && password === admin_password) {
			return response.status(200).json({ message: 'Login successful' });
		} else {
			return response.status(401).json({ message: 'Invalid password' });
		}
	} catch (error) {
		console.error(error);
		return response.status(500).json({ message: 'Internal server error' });
	}
}



