"use client";
import { useState } from "react";
import TemplateSelector from "../../components/TemplateSelector";
import ResumeEditor from "../../components/ResumeEditor";

export default function CreatePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Create New Resume</h1>
      {!selectedTemplate ? (
        <TemplateSelector onSelect={setSelectedTemplate} />
      ) : (
        <ResumeEditor template={selectedTemplate} />
      )}
    </div>
  );
}
