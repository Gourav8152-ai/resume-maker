import { useState } from "react";
import { jsPDF } from "jspdf";

interface AIReframerProps {
  content: string;
}

export default function AIReframer({ content }: AIReframerProps) {
  const [reframedContent, setReframedContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReframe = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Placeholder for AI reframing logic
      setReframedContent(content);
    } catch (err) {
      setError(
        "An error occurred while reframing the resume. Please try again.",
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const pdf = new jsPDF();
    const lines = pdf.splitTextToSize(reframedContent, 180);
    pdf.text(lines, 15, 15);
    pdf.save("reframed_resume.pdf");
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleReframe}
        disabled={isLoading}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {isLoading ? "Reframing..." : "Reframe with AI"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {reframedContent && (
        <>
          <div className="border p-4 rounded">
            <h3 className="text-xl font-bold mb-2">AI Reframed Resume</h3>
            <pre className="whitespace-pre-wrap">{reframedContent}</pre>
          </div>
          <button
            onClick={handleDownload}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Download PDF
          </button>
        </>
      )}
    </div>
  );
}
