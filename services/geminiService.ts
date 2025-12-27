
import { GoogleGenAI, Type } from "@google/genai";
import { Program, FilterState } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an AI consultation analysis based on user filters and search results.
 */
export const getAiConsultation = async (filters: FilterState, programs: Program[]) => {
  // Use correct properties from FilterState for ranking: minRank and maxRank
  const prompt = `
    作为一名资深留学咨询顾问，请根据以下用户的筛选条件和搜索到的大学项目，给出一个专业的选校分析建议。
    
    用户筛选条件：
    - 国家: ${filters.countries.join(', ') || '不限'}
    - 专业类别: ${filters.categories.join(', ') || '不限'}
    - 排名要求 (${filters.rankingType}): ${filters.minRank || '1'} 至 ${filters.maxRank || '不限'}
    - 预算范围: ${filters.costRanges.join(', ') || '不限'}
    - 搜索词: ${filters.searchQuery || '无'}
    
    搜索到的部分结果:
    ${programs.slice(0, 5).map(p => `${p.universityName} (${p.majorName}, QS:${p.qsRanking}, 学费:${p.tuition})`).join('\n')}
    
    请用中文回复，包含：
    1. 整体趋势分析
    2. 针对用户需求的重点推荐（选2-3个）
    3. 给该类学生的申请策略建议
    请简明扼要，排版美观。
  `;

  try {
    // Using gemini-3-flash-preview for the consultation text task.
    // Use ai.models.generateContent directly with model name and contents.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Use the .text property to access the generated content as a string.
    return response.text;
  } catch (error) {
    console.error("AI Consultation Error:", error);
    return "抱歉，AI 顾问暂时无法连接。请稍后再试。";
  }
};
