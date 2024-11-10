import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/lib/dbConnect';
import RuleBook from '@/models/RuleBook';

export default async function POST(request: NextApiRequest, response: NextApiResponse) {
	try {
		if (request.method !== 'POST') {
			return response.status(405).json({ message: 'Method not allowed' });
		}

		await dbConnect();
		const body = request.body;
		const { section, title, description, content } = body;
		if (!section || !title || !description || !content) {
			return response.status(400).json({ message: 'Missing required fields' });
		}

		// Check if the entry already exists
		const existingSection = await RuleBook.findOne({ title });
		if (existingSection) {
			return response.status(400).json({ message: 'Entry with this title already exists' });
		}
		const newSection = new RuleBook(body);
		await newSection.save();
		return response.status(200).json({ message: 'Entry created successfully' });
	} catch (error) {
		console.error(error);
		return response.status(500).json({ message: 'Internal server error' });
	}
}

