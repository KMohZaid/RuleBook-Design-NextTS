import FormComponent from './FormComponent';

interface EditPageProps {
	section: { _id: string, section: string, title: string, description: string, content: string };
}

export default function EditPageComponent({ section }: EditPageProps) {

	return section ? (
		<FormComponent
			actionText="Edit"
			initialData={section}
		/>
	) : (
		< h1>Error: Section not found</h1>
	);
}

