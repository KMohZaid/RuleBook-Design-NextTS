'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Section } from '@/models/RuleBook';

interface FormProps {
	actionText: string;
	initialData?: Section;
}

const FormComponent = ({ actionText, initialData }: FormProps) => {
	// Use internal state for form fields
	const [section, setSection] = useState(initialData?.section || '');
	const [title, setTitle] = useState(initialData?.title || '');
	const [description, setDescription] = useState(initialData?.description || '');
	const [content, setContent] = useState(initialData?.content || '');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [preview, setPreview] = useState(false);

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setError('');  // Clear any previous errors
		setSuccess('');  // Clear any previous success message

		// Validate input fields
		if (!section || !title || !description || !content) {
			setError('All fields are required!');
			return;
		}

		const isEdit = initialData?._id ? true : false;
		const apiUrl = isEdit ? `/api/edit/${initialData._id}` : '/api/edit';
		const method = isEdit ? 'PUT' : 'POST';

		const res = await fetch(apiUrl, {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ section, title, description, content }),
		});

		const json = await res.json();
		const msg = json.message ? `Status(${res.status}): ${json.message}` : null;

		if (res.ok) {
			setSuccess(msg || 'Entry created successfully');
		} else {
			setError(msg || 'Failed to create entry');
		}
	};


	return (
		<div className="flex flex-col items-center min-h-screen bg-gray-900 p-4">
			<Link href="/" className="text-blue-500 hover:underline mb-4">← Back to Home</Link>
			<Link href="/dashboard" className="text-blue-500 hover:underline mb-4">← Back to Dashboard</Link>

			<form
				onSubmit={(e) => {
					onSubmit(e);
				}}
				className="w-full max-w-lg p-8 bg-gray-800 rounded-lg shadow-lg"
			>
				<h2 className="text-2xl font-semibold mb-6 text-center text-white">{actionText} Page</h2>

				{error && (
					<div className="mb-4 p-3 bg-red-600 text-white rounded">
						{error}
					</div>
				)}

				{success && (
					<div className="mb-4 p-3 bg-green-600 text-white rounded">
						{success}
					</div>
				)}

				<div className="mb-4">
					<input
						type="text"
						placeholder="Section (e.g., Rules, Wiki, FAQ)"
						value={section}
						onChange={(e) => setSection(e.target.value)}
						className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div className="mb-4">
					<input
						type="text"
						placeholder="Title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div className="mb-4">
					<input
						type="text"
						placeholder="Description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div className="mb-6">
					<textarea
						placeholder="HTML Content"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						className="w-full p-3 h-32 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
					></textarea>
				</div>

				<p className="text-sm text-gray-400 mb-4">
					Note: <strong>h2 and h3 tags</strong> color are set to red for content. Also, please click the preview button to see how it will look after changing HTML.
				</p>

				{/* Preview Button */}
				<button
					type="button"
					onClick={() => setPreview(!preview)}
					className="w-full p-3 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4"
				>
					{preview ? 'Hide' : 'Show'} Preview
				</button>

				{/* Preview Display */}
				{preview && (
					<div className="w-full max-w-lg p-6 bg-gray-700 rounded-lg shadow-lg text-white mb-4">
						<h3 className="text-xl font-semibold">{title}</h3>
						<p className="text-gray-400">{description}</p>
						<div
							id="content-container"
							className="content-preview mb-6 max-h-[60vh] overflow-y-auto p-2 bg-gray-900 rounded border border-gray-700"
							dangerouslySetInnerHTML={{ __html: content }}
						/>
					</div>
				)}

				<button
					type="submit"
					className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					onClick={onSubmit}
				>
					{actionText}
				</button>
			</form>
		</div>
	);
};

export default FormComponent;

