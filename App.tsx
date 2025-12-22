import React, { useState, useEffect } from 'react';
import { DiseaseList } from './components/DiseaseList';
import { AuditPanel } from './components/AuditPanel';
import { AuditHistory } from './components/AuditHistory';
import { diseaseDatabase } from './data';
import { ShieldCheck, History } from 'lucide-react';
import { AuditRecord } from './types';

const App: React.FC = () => {
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<number | null>(diseaseDatabase[0]?.id || null);
  
  // Initialize from LocalStorage to prevent data loss on refresh
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>(() => {
    try {
      const saved = localStorage.getItem('jiangxi_audit_records');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load records", e);
      return [];
    }
  });

  const [showHistory, setShowHistory] = useState(false);

  // Save to LocalStorage whenever records change
  useEffect(() => {
    try {
      localStorage.setItem('jiangxi_audit_records', JSON.stringify(auditRecords));
    } catch (e) {
      console.error("Failed to save records", e);
    }
  }, [auditRecords]);

  const selectedDisease = diseaseDatabase.find(d => d.id === selectedDiseaseId);

  const handleAuditSubmit = (record: AuditRecord) => {
    setAuditRecords(prev => [record, ...prev]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden text-gray-800 font-sans">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center px-6 z-20 shrink-0 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
             <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 leading-none">医保审核助手</h1>
            <p className="text-xs text-gray-500 mt-1">江西省门诊慢性病、特殊病认定标准辅助系统</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setShowHistory(!showHistory)}
             className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
               showHistory 
                 ? 'bg-blue-50 text-blue-700' 
                 : 'text-gray-600 hover:bg-gray-100'
             }`}
           >
             <History className="w-4 h-4" />
             审核记录
             {auditRecords.length > 0 && (
                <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                    {auditRecords.length}
                </span>
             )}
           </button>
           
           <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block"></div>
           
           <div className="flex items-center gap-2 text-sm">
             <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-600">
               操作员: 医保专员
             </span>
             <span className="text-gray-400">v1.0.0</span>
           </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {showHistory ? (
            <div className="w-full h-full">
                <AuditHistory records={auditRecords} onBack={() => setShowHistory(false)} />
            </div>
        ) : (
            <>
                {/* Sidebar */}
                <aside className="hidden md:block h-full z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                  <DiseaseList 
                    diseases={diseaseDatabase} 
                    selectedDiseaseId={selectedDiseaseId}
                    onSelect={setSelectedDiseaseId}
                  />
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 h-full relative overflow-hidden">
                  {selectedDisease ? (
                    <AuditPanel 
                        disease={selectedDisease} 
                        onSubmit={handleAuditSubmit}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <ShieldCheck className="w-16 h-16 mb-4 opacity-20" />
                      <p>请从左侧列表选择病种开始审核</p>
                    </div>
                  )}
                </main>
            </>
        )}
      </div>
    </div>
  );
};

export default App;