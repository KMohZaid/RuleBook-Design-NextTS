import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import RuleBook from '@/models/RuleBook';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;
	await dbConnect();

	if (req.method === 'PUT') {
		try {
			const updatedEntry = await RuleBook.findByIdAndUpdate(id, req.body, { new: true });
			if (!updatedEntry) {
				return res.status(404).json({ message: 'Entry not found' });
			}
			res.status(200).json({ message: 'Entry updated successfully', updatedEntry });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Internal server error' });
		}
	} else {
		res.status(405).json({ message: 'Method not allowed' });
	}
}
