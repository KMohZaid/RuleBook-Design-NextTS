import { useState } from 'react';
import Link from 'next/link';
import { dbConnect } from '@/lib/dbConnect';
import RuleBook from '@/models/RuleBook';
import { Section } from '@/models/RuleBook';
import mongoose from 'mongoose';

export default function Dashboard({ sections }: { sections: Section[] }) {
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [sectionsState, setSectionsState] = useState(sections);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [deleteSectionId, setDeleteSectionId] = useState<string | null>(null);
  const [confirmStep, setConfirmStep] = useState<number>(0);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const isNoSection = !sectionsState || sectionsState.length === 0;

  const uniqueSections = isNoSection ? [] : Array.from(new Set(sectionsState.map(section => section.section)));
  const [activeTab, setActiveTab] = useState(isNoSection ? "" : uniqueSections[0]);

  if (isNoSection) {
    return (
      <div className="flex flex-col items-center min-h-screen bg-gray-900 p-6">
        <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>
        <p className="text-gray-400">No Sections Available</p>
      </div>
    );
  }


  const handleDelete = async (id: string) => {
    // Open the confirmation modal
    setDeleteSectionId(id);
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    if (confirmStep < 2) {
      // If not the final step, increase confirmation step
      setConfirmStep(confirmStep + 1);
    } else {
      // Final step: Perform deletion
      const res = await fetch(`/api/delete/${deleteSectionId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // If deletion is successful, remove the section from state and show success message
        setSectionsState((prevSections) =>
          prevSections.filter((section) => section._id !== deleteSectionId)
        );
        setMessage('Section deleted successfully');
        setMessageType('success');
      } else {
        // Handle error and show error message
        setMessage('Failed to delete section');
        setMessageType('error');
      }

      // Reset and close the modal
      setShowConfirmModal(false);
      setConfirmStep(0);
      setDeleteSectionId(null);
    }
  };

  const handleCancel = () => {
    // Reset the confirmation and close the modal
    setShowConfirmModal(false);
    setConfirmStep(0);
    setDeleteSectionId(null);
  };




  const switchTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>
      <Link href="/" className="text-blue-500 hover:underline mb-4">← Back to Home</Link>
      <Link href="/create" className="text-blue-500 hover:underline mb-4">Create New Entry</Link>

      {/* Display success or error message */}
      {message && (
        <div
          className={`p-4 mb-6 text-center rounded-lg ${messageType === 'success'
            ? 'bg-green-600 text-white'
            : 'bg-red-600 text-white'
            }`}
        >
          {message}
        </div>
      )}

      {/* Tab buttons */}
      <div className="flex gap-4 mb-6">
        {uniqueSections.map((sectionName) => (
          <button
            key={sectionName}
            onClick={() => switchTab(sectionName)}
            className={`px-4 py-2 rounded-lg ${activeTab === sectionName ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            {sectionName}
          </button>
        ))}
      </div>

      {/* Displaying content based on active tab */}
      <div className="w-full max-w-4xl bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700 text-red-600">
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sectionsState
              .filter((section) => section.section === activeTab) // Filter by active section
              .map((section) => (
                <tr key={section._id} className="hover:bg-gray-700">
                  <td className="py-3 px-4">{section.title}</td>
                  <td className="py-3 px-4">{section.description}</td>
                  <td className="py-3 px-4 text-center flex gap-2 justify-center">
                    <Link href={`/edit/${section._id}`}>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => setPreviewContent(section.content)}
                      className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded"
                    >
                      Preview Content
                    </button>
                    <button
                      onClick={() => handleDelete(section._id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Deletion Confirmation */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto relative">
            <h2 className="text-2xl font-semibold mb-4">
              {confirmStep === 0
                ? 'Are you sure you want to delete this section?'
                : `Are you sure you want to delete this section? (Step ${confirmStep + 1}/3)`}
            </h2>

            {/* Button placement logic */}
            <div className="flex justify-between gap-4">
              {/* Cancel Button */}
              <button
                onClick={handleCancel}
                className={`bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded w-full mt-4 ${confirmStep === 0 ? 'order-1' : confirmStep === 1 ? 'order-2' : 'order-3'
                  }`}
              >
                Cancel
              </button>

              {/* Confirm Button */}
              <button
                onClick={handleConfirm}
                className={`bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded w-full mt-4 ${confirmStep === 0 ? 'order-2' : confirmStep === 1 ? 'order-1' : 'order-3'
                  }`}
              >
                {confirmStep === 2 ? 'Confirm' : 'Next Step'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Preview Content */}
      {previewContent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setPreviewContent(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-100 bg-transparent border-none text-lg font-semibold"
              aria-label="Close"
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold mb-4">Content Preview</h2>
            <div
              id="content-container"
              className="content-preview mb-6 max-h-[60vh] overflow-y-auto p-2 bg-gray-900 rounded-lg"
              dangerouslySetInnerHTML={{ __html: previewContent }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps() {
  await dbConnect();
  const collections = await RuleBook.find().lean();

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

  return {
    props: {
      sections,
    },
  };
}

