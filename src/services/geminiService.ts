import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ParsedActivity {
  type: '运动' | '学习' | '出行' | '干饭' | '其他';
  title: string;
  time: string;
  location: string;
  level: string;
  requirements: string;
  intro: string;
}

export async function parseActivityInput(input: string): Promise<ParsedActivity | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `解析以下校园社交需求并返回JSON: "${input}"`,
      config: {
        systemInstruction: "你是一个校园社交助手。解析用户的模糊输入为结构化数据。type必须是 ['运动', '学习', '出行', '干饭', '其他'] 之一。intro是自我介绍。requirements是搭子要求。尽量简练。",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, description: "活动类型" },
            title: { type: Type.STRING, description: "总结后的活动标题" },
            time: { type: Type.STRING, description: "时间点" },
            location: { type: Type.STRING, description: "具体地点" },
            level: { type: Type.STRING, description: "活动水平" },
            requirements: { type: Type.STRING, description: "搭子要求" },
            intro: { type: Type.STRING, description: "一句话自我介绍" }
          },
          required: ["type", "title", "time", "location", "level", "requirements", "intro"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as ParsedActivity;
  } catch (error) {
    console.error("AI parsing failed:", error);
    return null;
  }
}
