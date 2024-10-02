import { useState } from 'react'

interface ResumeUploaderProps {
  onUpload: (content: string) => void
}

export default function ResumeUploader({ onUpload }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (file) {
      const content = await file.text()
      onUpload(content)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={!file}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        Upload Resume
      </button>
    </div>
  )
}