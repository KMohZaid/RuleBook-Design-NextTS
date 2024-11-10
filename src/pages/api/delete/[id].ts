import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/lib/dbConnect';
import RuleBook from '@/models/RuleBook';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;

	if (req.method === 'DELETE') {
		try {
			await dbConnect();

			// Find and delete the section by its ID
			const deletedSection = await RuleBook.findByIdAndDelete(id);

			if (!deletedSection) {
				return res.status(404).json({ message: 'Section not found' });
			}

			res.status(200).json({ message: 'Section deleted successfully' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Internal server error' });
		}
	} else {
		res.status(405).json({ message: 'Method Not Allowed' });
	}
}

