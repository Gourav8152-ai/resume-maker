'use client'
import { useState } from 'react'
import ResumeUploader from '../../components/ResumeUploader'
import ResumeEditor from '../../components/ResumeEditor'
import AIReframer from '../../components/AIReframer'

export default function UploadPage() {
  const [uploadedResume, setUploadedResume] = useState<string | null>(null)
  const [editMode, setEditMode] = useState<'ai' | 'manual' | null>(null)

  const handleUpload = (content: string) => {
    setUploadedResume(content)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Upload Existing Resume</h1>
      {!uploadedResume && <ResumeUploader onUpload={handleUpload} />}
      {uploadedResume && !editMode && (
        <div className="flex space-x-4 mt-4">
          <button
            onClick={() => setEditMode('ai')}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Reframe with AI
          </button>
          <button
            onClick={() => setEditMode('manual')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Manual Edit
          </button>
        </div>
      )}
      {editMode === 'ai' && <AIReframer content={uploadedResume} />}
      {editMode === 'manual' && <ResumeEditor content={uploadedResume} />}
    </div>
  )
}