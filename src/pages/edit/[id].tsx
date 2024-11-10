'use client';
import EditPageComponent from '@/components/EditPageComponent';
import { dbConnect } from '@/lib/dbConnect';
import RuleBook from '@/models/RuleBook';

export default function EditPage({ section }) {
	return <EditPageComponent section={section} />;
}

export async function getServerSideProps(context) {
	const { id } = context.params;
	await dbConnect();
	const section = await RuleBook.findById(id).lean();
	section._id = section._id.toString();

	return { props: { section } };
}
