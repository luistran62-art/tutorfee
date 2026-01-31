import { GoogleGenAI, Type } from "@google/genai";
import { Email, EmailAnalysisResult } from "../types";

// Initialize Gemini
// NOTE: Users must provide their own API Key via the UI or env in a real app.
// Here we assume it is available in the environment context provided.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeEmailWithGemini = async (email: Email): Promise<EmailAnalysisResult> => {
  const modelId = "gemini-2.5-flash-latest"; // Using flash for speed and cost effectiveness on simple text tasks

  const prompt = `
    Bạn là một trợ lý AI giúp quản lý lịch dạy học.
    Hãy phân tích nội dung email dưới đây để xác định xem học sinh có xin nghỉ, xin đổi lịch hay không.
    
    Email Subject: ${email.subject}
    Email Content: ${email.snippet}
    Email Date: ${email.date.toISOString()}

    Trích xuất các thông tin sau dưới dạng JSON:
    1. relatedStudentName: Tên học sinh được nhắc đến (nếu có).
    2. targetDate: Ngày buổi học bị ảnh hưởng (ISO string YYYY-MM-DD). Nếu email nói "hôm qua", "ngày mai", hãy tính dựa trên Email Date.
    3. action: 'CANCEL' (nghỉ học), 'RESCHEDULE' (đổi lịch), 'CONFIRM' (xác nhận), hoặc 'UNKNOWN'.
    4. reason: Lý do ngắn gọn (nếu có).
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            relatedStudentName: { type: Type.STRING, nullable: true },
            targetDate: { type: Type.STRING, nullable: true },
            action: { type: Type.STRING, enum: ['CANCEL', 'RESCHEDULE', 'CONFIRM', 'UNKNOWN'] },
            reason: { type: Type.STRING, nullable: true }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as EmailAnalysisResult;
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      relatedStudentName: null,
      targetDate: null,
      action: 'UNKNOWN',
      reason: 'AI Analysis Failed'
    };
  }
};