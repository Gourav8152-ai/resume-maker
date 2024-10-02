import { useState } from 'react'
import jsPDF from 'jspdf'
import { reframeWithAI } from '../lib/gemini'

interface ResumeEditorProps {
  content?: string
  template?: string
}

interface ResumeData {
  contactInfo: string
  summary: string
  workExperience: string[]
  education: string[]
  skills: string[]
  certifications: string[]
  customSections: { title: string; content: string }[]
}

export default function ResumeEditor({ content, template }: ResumeEditorProps) {
  const [resumeData, setResumeData] = useState<ResumeData>({
    contactInfo: '',
    summary: '',
    workExperience: [''],
    education: [''],
    skills: [''],
    certifications: [''],
    customSections: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (field: keyof ResumeData, value: string | string[], index?: number) => {
    setResumeData((prev) => {
      if (Array.isArray(prev[field]) && typeof index === 'number') {
        const newArray = [...prev[field] as string[]]
        newArray[index] = value as string
        return { ...prev, [field]: newArray }
      }
      return { ...prev, [field]: value }
    })
  }

  const addListItem = (field: keyof ResumeData) => {
    setResumeData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), ''],
    }))
  }

  const removeListItem = (field: keyof ResumeData, index: number) => {
    setResumeData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }))
  }

  const handleSave = () => {
    const pdf = new jsPDF()
    let yOffset = 10

    // Helper function to add a section to the PDF
    const addSection = (title: string, content: string | string[]) => {
      pdf.setFontSize(16)
      pdf.text(title, 10, yOffset)
      yOffset += 10
      pdf.setFontSize(12)
      if (Array.isArray(content)) {
        content.forEach((item) => {
          const lines = pdf.splitTextToSize(item, 180)
          pdf.text(lines, 10, yOffset)
          yOffset += lines.length * 7
        })
      } else {
        const lines = pdf.splitTextToSize(content, 180)
        pdf.text(lines, 10, yOffset)
        yOffset += lines.length * 7
      }
      yOffset += 10
    }

    // Add sections to the PDF
    addSection('Contact Information', resumeData.contactInfo)
    addSection('Summary', resumeData.summary)
    addSection('Work Experience', resumeData.workExperience)
    addSection('Education', resumeData.education)
    addSection('Skills', resumeData.skills)
    addSection('Certifications', resumeData.certifications)
    resumeData.customSections.forEach((section) => {
      addSection(section.title, section.content)
    })

    pdf.save('resume.pdf')
  }

  const handleAICreate = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const content = Object.entries(resumeData)
        .map(([key, value]) => `${key}:\n${Array.isArray(value) ? value.join('\n') : value}`)
        .join('\n\n')
      const aiGeneratedContent = await reframeWithAI(content)

      // Parse the AI-generated content and update the resumeData state
      // This is a simplified parsing logic and might need to be adjusted based on the AI output format
      const sections = aiGeneratedContent.split('\n\n')
      const newResumeData: Partial<ResumeData> = {}
      sections.forEach((section) => {
        const [title, ...content] = section.split('\n')
        const key = title.toLowerCase().replace(' ', '') as keyof ResumeData
        if (key in resumeData) {
          newResumeData[key] = Array.isArray(resumeData[key]) ? content : content.join('\n')
        }
      })
      setResumeData((prev) => ({ ...prev, ...newResumeData }))
    } catch (err) {
      setError('An error occurred while creating the resume with AI. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const renderSection = (title: string, field: keyof ResumeData, isArray: boolean = false) => (
    <div className="mb-4">
      <label className="block mb-2 font-bold">{title}</label>
      {isArray ? (
        <>
          {(resumeData[field] as string[]).map((item, index) => (
            <div key={index} className="flex mb-2">
              <textarea
                className="w-full p-2 border rounded"
                value={item}
                onChange={(e) => handleChange(field, e.target.value, index)}
              />
              <button
                onClick={() => removeListItem(field, index)}
                className="ml-2 bg-red-500 text-white px-2 rounded"
              >
                -
              </button>
            </div>
          ))}
          <button
            onClick={() => addListItem(field)}
            className="bg-green-500 text-white px-2 py-1 rounded"
          >
            + Add {title}
          </button>
        </>
      ) : (
        <textarea
          className="w-full p-2 border rounded"
          value={resumeData[field] as string}
          onChange={(e) => handleChange(field, e.target.value)}
        />
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      {renderSection('Contact Information', 'contactInfo')}
      {renderSection('Summary', 'summary')}
      {renderSection('Work Experience', 'workExperience', true)}
      {renderSection('Education', 'education', true)}
      {renderSection('Skills', 'skills', true)}
      {renderSection('Certifications', 'certifications', true)}

      {/* Custom Sections */}
      {resumeData.customSections.map((section, index) => (
        <div key={index} className="mb-4">
          <input
            className="w-full p-2 border rounded mb-2"
            value={section.title}
            onChange={(e) => {
              const newCustomSections = [...resumeData.customSections]
              newCustomSections[index].title = e.target.value
              setResumeData((prev) => ({ ...prev, customSections: newCustomSections }))
            }}
            placeholder="Section Title"
          />
          <textarea
            className="w-full p-2 border rounded"
            value={section.content}
            onChange={(e) => {
              const newCustomSections = [...resumeData.customSections]
              newCustomSections[index].content = e.target.value
              setResumeData((prev) => ({ ...prev, customSections: newCustomSections }))
            }}
            placeholder="Section Content"
          />
        </div>
      ))}
      <button
        onClick={() => setResumeData((prev) => ({
          ...prev,
          customSections: [...prev.customSections, { title: '', content: '' }]
        }))}
        className="bg-green-500 text-white px-2 py-1 rounded"
      >
        + Add Custom Section
      </button>

      <div className="flex space-x-4 mt-4">
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save and Download PDF
        </button>
        <button
          onClick={handleAICreate}
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create with AI'}
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}