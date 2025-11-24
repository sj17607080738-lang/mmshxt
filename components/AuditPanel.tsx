import React, { useState, useEffect, useMemo } from 'react';
import { Disease, AuditRecord } from '../types';
import { 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  RotateCcw, 
  ClipboardCheck, 
  Sparkles, 
  Upload, 
  X, 
  Bot, 
  Loader2,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  ArrowDown,
  User,
  CreditCard,
  Save
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface AuditPanelProps {
  disease: Disease;
  onSubmit: (record: AuditRecord) => void;
}

interface AIAnalysisResult {
  applicantInfo?: {
    name: string;
    idNumber: string;
  };
  analysis: {
    criterionId: string;
    isMet: boolean;
    reasoning: string;
  }[];
  overallAssessment?: {
    suggestion: "PASS" | "FAIL" | "REVIEW";
    summary: string;
  };
}

interface UploadedFile {
  file: File;
  id: string;
}

export const AuditPanel: React.FC<AuditPanelProps> = ({ disease, onSubmit }) => {
  const [selectedCriteria, setSelectedCriteria] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState('');
  
  // Applicant Info State
  const [applicantName, setApplicantName] = useState('');
  const [applicantId, setApplicantId] = useState('');

  // AI State
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResultData, setAiResultData] = useState<AIAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Helper to get individual criterion result
  const getCriterionResult = (id: string) => {
    return aiResultData?.analysis.find(item => item.criterionId === id);
  };

  // Reset state when disease changes
  useEffect(() => {
    setSelectedCriteria(new Set());
    setNotes('');
    setFiles([]);
    setAiResultData(null);
    setAnalysisError(null);
    setApplicantName('');
    setApplicantId('');
  }, [disease.id]);

  const toggleCriterion = (id: string) => {
    const newSet = new Set(selectedCriteria);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedCriteria(newSet);
  };

  const isEligible = useMemo(() => {
    return disease.isEligible(selectedCriteria);
  }, [disease, selectedCriteria]);

  const progress = Math.round((selectedCriteria.size / disease.criteria.length) * 100);

  // --- File Handling ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(f => ({
        file: f,
        id: Math.random().toString(36).substring(7)
      }));
      setFiles(prev => [...prev, ...newFiles]);
      setAnalysisError(null);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  // --- Gemini AI Integration ---
  const fileToPart = async (file: File) => {
    return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          resolve({
            inlineData: {
              data: (reader.result as string).split(',')[1],
              mimeType: file.type
            }
          });
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const runAIAnalysis = async () => {
    if (files.length === 0) return;
    
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAiResultData(null);

    try {
      // 1. Prepare Inputs
      const fileParts = await Promise.all(files.map(f => fileToPart(f.file)));
      const criteriaText = disease.criteria.map(c => `ID: ${c.id}\n内容: ${c.content}`).join('\n\n');
      
      const prompt = `
        角色：专业的医保审核专家。
        任务：针对病种 "${disease.name}" 的认定标准进行审核。
        
        【重要任务】：
        请在上传的图片中查找 "江西省门诊慢特病病种待遇认定申请表"。如果找到，请务必提取表格中的 "姓名" 和 "身份证件号码"。
        
        【认定逻辑规则】：${disease.logicDescription}
        
        指令：
        1. 逐条分析上传的医疗单据（图像/PDF），检查是否有满足以下【审核标准列表】的证据。
        2. 审核要求严格：如果缺少特定单据（如病理报告、出院小结）或数值不符合标准，标记为 false。
        3. **综合研判**：根据【认定逻辑规则】和你找到的证据，给出最终的"辅助结论"（建议通过/建议不通过/需人工复核）。
        4. reasoning 和 summary 字段必须使用**中文**回答。请简要解释理由，引用单据名称或具体发现的数值/诊断结论。
        
        【审核标准列表】：
        ${criteriaText}
      `;

      // 2. Initialize Gemini
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // 3. Call Model
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [...fileParts, { text: prompt }] }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              applicantInfo: {
                type: Type.OBJECT,
                description: "Extracted from the application form",
                properties: {
                    name: { type: Type.STRING },
                    idNumber: { type: Type.STRING }
                }
              },
              analysis: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    criterionId: { type: Type.STRING },
                    isMet: { type: Type.BOOLEAN },
                    reasoning: { type: Type.STRING, description: "Explanation in Chinese" },
                  },
                  required: ["criterionId", "isMet", "reasoning"]
                }
              },
              overallAssessment: {
                type: Type.OBJECT,
                properties: {
                  suggestion: { 
                    type: Type.STRING, 
                    enum: ["PASS", "FAIL", "REVIEW"],
                    description: "PASS for eligible, FAIL for ineligible, REVIEW for missing critical docs"
                  },
                  summary: { type: Type.STRING, description: "Final conclusion summary in Chinese" }
                },
                required: ["suggestion", "summary"]
              }
            }
          }
        }
      });

      // 4. Process Result
      const resultText = response.text;
      if (resultText) {
        const data = JSON.parse(resultText) as AIAnalysisResult;
        setAiResultData(data);
        
        // Auto-fill applicant info if found
        if (data.applicantInfo?.name) setApplicantName(data.applicantInfo.name);
        if (data.applicantInfo?.idNumber) setApplicantId(data.applicantInfo.idNumber);
      }

    } catch (err) {
      console.error("AI Analysis Failed:", err);
      setAnalysisError("智能分析服务暂时不可用，请检查网络或手动审核。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyAiResults = () => {
    if (!aiResultData) return;
    
    const newSet = new Set(selectedCriteria);
    aiResultData.analysis.forEach(item => {
      if (item.isMet) {
        newSet.add(item.criterionId);
      }
    });
    setSelectedCriteria(newSet);
  };

  const handleSubmit = () => {
    if (!applicantName || !applicantId) {
        alert("请填写申请人姓名和身份证号");
        return;
    }
    
    const record: AuditRecord = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        applicantName,
        applicantId,
        diseaseId: disease.id,
        diseaseName: disease.name,
        result: isEligible ? 'PASS' : 'FAIL',
        criteriaMet: Array.from(selectedCriteria),
        notes
    };
    
    onSubmit(record);
    alert("审核结果已提交");
    // Optional: clear form
    setSelectedCriteria(new Set());
    setNotes('');
    setApplicantName('');
    setApplicantId('');
    setFiles([]);
    setAiResultData(null);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5 shadow-sm sticky top-0 z-10">
        <div className="flex justify-between items-start">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold uppercase tracking-wide">
                        {disease.category || '通用'}
                    </span>
                    <span className="text-xs text-gray-500">ID: {disease.id}</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">{disease.name}</h1>
            </div>
            
            {/* Result Badge - Realtime Logic Check */}
            <div className={`px-4 py-2 rounded-full flex items-center gap-2 font-bold border ${
                isEligible 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'bg-gray-100 text-gray-500 border-gray-200'
            }`}>
                {isEligible ? (
                    <>
                        <CheckCircle2 className="w-6 h-6" />
                        <span>符合认定标准</span>
                    </>
                ) : (
                    <>
                        <AlertCircle className="w-6 h-6" />
                        <span>材料不足</span>
                    </>
                )}
            </div>
        </div>

        {/* Applicant Info Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded border border-gray-200">
                <User className="w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="申请人姓名 (上传申请表可自动提取)"
                    className="flex-1 outline-none text-sm text-gray-700 font-medium"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded border border-gray-200">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="身份证件号码 (上传申请表可自动提取)"
                    className="flex-1 outline-none text-sm text-gray-700 font-medium"
                    value={applicantId}
                    onChange={(e) => setApplicantId(e.target.value)}
                />
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 max-w-6xl mx-auto w-full">
        
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left Column: Criteria List */}
            <div className="xl:col-span-7 space-y-6">
                
                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
                    <FileText className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-medium text-blue-900">审核操作指引</h3>
                        <p className="text-sm text-blue-700 mt-1">
                            请仔细核对申请人提交的纸质或电子病历材料。您可以使用右侧的 <span className="font-bold">智能助手</span> 辅助分析单据，并自动提取人员信息。
                        </p>
                    </div>
                </div>

                {/* Criteria Checkboxes */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <ClipboardCheck className="w-5 h-5 text-gray-500"/>
                            认定材料清单
                        </h3>
                        <div className="flex items-center gap-4">
                            {aiResultData && (
                                <button 
                                    onClick={applyAiResults}
                                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors flex items-center gap-1 font-medium"
                                >
                                    <Sparkles className="w-3 h-3" />
                                    一键采纳 AI 结果
                                </button>
                            )}
                            <span className="text-xs text-gray-500">已选 {selectedCriteria.size} / {disease.criteria.length} 项</span>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {disease.criteria.map((criterion) => {
                            const aiResult = getCriterionResult(criterion.id);
                            const isAiSuggested = aiResult?.isMet;

                            return (
                                <div 
                                    key={criterion.id} 
                                    className={`p-4 transition-colors hover:bg-gray-50 ${
                                        selectedCriteria.has(criterion.id) ? 'bg-blue-50/40' : ''
                                    } ${isAiSuggested ? 'bg-purple-50/60' : ''}`}
                                >
                                    <label className="flex items-start gap-4 cursor-pointer">
                                        <div className="pt-1">
                                            <input 
                                                type="checkbox" 
                                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                                checked={selectedCriteria.has(criterion.id)}
                                                onChange={() => toggleCriterion(criterion.id)}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-gray-700">
                                                    条款 ({criterion.id})
                                                </span>
                                                {isAiSuggested && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 animate-pulse">
                                                        <Sparkles className="w-3 h-3" />
                                                        AI 建议勾选
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-gray-600 text-sm leading-relaxed block">
                                                {criterion.content}
                                            </span>
                                            
                                            {/* AI Reasoning Box - Inside Item */}
                                            {aiResult && (
                                                <div className={`mt-3 text-xs p-3 rounded border ${
                                                    isAiSuggested 
                                                    ? 'bg-purple-50 border-purple-100 text-purple-800'
                                                    : 'bg-gray-100 border-gray-200 text-gray-500'
                                                }`}>
                                                    <div className="flex gap-2">
                                                        <Bot className="w-4 h-4 shrink-0" />
                                                        <div>
                                                            <span className="font-semibold block mb-1">
                                                                {isAiSuggested ? 'AI 识别证据：' : 'AI 未找到明显证据：'}
                                                            </span>
                                                            {aiResult.reasoning}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                     <button 
                        onClick={() => {
                            setSelectedCriteria(new Set());
                            setAiResultData(null);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        重置所有选项
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={!applicantName || !applicantId}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white shadow-md transition-all ${
                            !applicantName || !applicantId 
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        <Save className="w-5 h-5" />
                        提交审核结果
                    </button>
                </div>
            </div>

            {/* Right Column: AI Tool & Logic */}
            <div className="xl:col-span-5 space-y-6">
                
                {/* AI Assistant Card */}
                <div className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden ring-1 ring-purple-50">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-4 text-white flex justify-between items-center">
                         <h3 className="font-semibold flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            智能材料预审
                         </h3>
                         <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">Gemini 2.5 Flash</span>
                    </div>
                    
                    <div className="p-5">
                         {/* AI Final Conclusion Section - ONLY SHOW IF RESULTS EXIST */}
                        {aiResultData && aiResultData.overallAssessment && (
                            <div className={`mb-6 p-4 rounded-lg border-l-4 shadow-sm ${
                                aiResultData.overallAssessment.suggestion === 'PASS' 
                                ? 'bg-green-50 border-green-500' 
                                : aiResultData.overallAssessment.suggestion === 'FAIL'
                                ? 'bg-red-50 border-red-500'
                                : 'bg-orange-50 border-orange-400'
                            }`}>
                                <div className="flex items-start gap-3">
                                    {aiResultData.overallAssessment.suggestion === 'PASS' ? (
                                        <ThumbsUp className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                    ) : aiResultData.overallAssessment.suggestion === 'FAIL' ? (
                                        <ThumbsDown className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                    ) : (
                                        <HelpCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                    )}
                                    <div>
                                        <h4 className={`font-bold text-sm mb-1 ${
                                            aiResultData.overallAssessment.suggestion === 'PASS' ? 'text-green-800' : 
                                            aiResultData.overallAssessment.suggestion === 'FAIL' ? 'text-red-800' : 'text-orange-800'
                                        }`}>
                                            AI 辅助结论：
                                            {aiResultData.overallAssessment.suggestion === 'PASS' ? '建议通过' : 
                                             aiResultData.overallAssessment.suggestion === 'FAIL' ? '建议不通过' : '需补充材料'}
                                        </h4>
                                        <p className="text-sm text-gray-700 leading-snug">
                                            {aiResultData.overallAssessment.summary}
                                        </p>
                                        
                                        <button 
                                            onClick={applyAiResults}
                                            className="mt-3 text-xs bg-white border border-gray-200 shadow-sm px-3 py-1.5 rounded flex items-center gap-2 hover:bg-gray-50 transition-colors font-medium text-gray-700"
                                        >
                                            <ArrowDown className="w-3 h-3" />
                                            一键采纳 AI 分析结果
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="relative border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-purple-300 transition-colors bg-gray-50/50">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 font-medium">点击上传或拖拽文件</p>
                            <p className="text-xs text-gray-400 mt-1">支持 PDF、JPG、PNG 格式</p>
                            <input 
                                type="file" 
                                multiple 
                                accept=".pdf,image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                style={{ display: 'none' }}
                                id="file-upload"
                                onChange={handleFileSelect}
                            />
                            <label htmlFor="file-upload" className="absolute inset-0 cursor-pointer"></label>
                        </div>

                        {/* File List */}
                        {files.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {files.map(f => (
                                    <div key={f.id} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded text-sm border border-gray-100">
                                        <div className="flex items-center gap-2 truncate max-w-[80%]">
                                            <FileText className="w-4 h-4 text-gray-400" />
                                            <span className="truncate text-gray-600">{f.file.name}</span>
                                        </div>
                                        <button onClick={() => removeFile(f.id)} className="text-gray-400 hover:text-red-500">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Analysis Button */}
                        <button
                            onClick={runAIAnalysis}
                            disabled={files.length === 0 || isAnalyzing}
                            className={`w-full mt-4 py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${
                                files.length === 0 || isAnalyzing
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg'
                            }`}
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    正在分析材料...
                                </>
                            ) : (
                                <>
                                    <Bot className="w-4 h-4" />
                                    开始智能分析
                                </>
                            )}
                        </button>

                        {analysisError && (
                            <div className="mt-3 text-xs text-red-600 bg-red-50 p-2 rounded flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {analysisError}
                            </div>
                        )}
                        
                         <div className="mt-3 text-[10px] text-gray-400 text-center">
                            注：AI分析仅供参考，必须由人工最终确认。请勿上传高度敏感的个人隐私数据。
                        </div>
                    </div>
                </div>

                {/* Logic Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <h3 className="font-semibold text-gray-800 mb-3 border-b border-gray-100 pb-2">认定逻辑公式</h3>
                    <div className="bg-gray-100 rounded p-3 font-mono text-sm text-gray-700 break-words">
                        {disease.logicDescription}
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>完成度</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className={`h-2 rounded-full transition-all duration-500 ${
                                    isEligible ? 'bg-green-500' : 'bg-blue-400'
                                }`} 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Notes Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col h-48">
                    <h3 className="font-semibold text-gray-800 mb-3">审核备注</h3>
                    <textarea
                        className="flex-1 w-full resize-none border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="在此记录缺失材料详情、特殊情况说明..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};