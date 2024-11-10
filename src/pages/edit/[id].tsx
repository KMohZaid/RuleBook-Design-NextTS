'use client';
import EditPageComponent from '@/components/EditPageComponent';
import { dbConnect } from '@/lib/dbConnect';
import RuleBook from '@/models/RuleBook';
import { Section } from '@/models/RuleBook';
import mongoose from 'mongoose';

export default function EditPage({ section }: { section: Section }) {
	return <EditPageComponent section={section} />;
}

export async function getServerSideProps(context: any) {
	const { id } = context.params;
	await dbConnect();
	const collections = await RuleBook.find({ _id: id }).lean();
	const sections: Section[] = collections.map((section) => {
		const _id = section._id as mongoose.ObjectId;
		return {
			_id: _id.toString(),
			section: section.section,
			title: section.title,
			description: section.description,
			content: section.content,
		}
	});

	return { props: { section: sections[0] } };
}
