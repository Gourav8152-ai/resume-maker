import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  "AIzaSyDgl1fiz-_fDqd7sAxuPyxwT7ZucOSxAwU" || "",
);

export async function reframeWithAI(content: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Reframe the following resume content to be ATS-friendly and professionally formatted:

${content}

Please provide the reframed resume content in a clear, concise format suitable for a professional resume. Include appropriate sections such as Contact Information, Summary, Work Experience, Education, Skills, and any other relevant categories. Ensure the content is optimized for Applicant Tracking Systems (ATS) by using standard section headings and focusing on relevant keywords and achievements.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return text;
}
