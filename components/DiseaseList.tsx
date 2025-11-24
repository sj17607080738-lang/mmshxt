import React, { useState, useMemo } from 'react';
import { Disease } from '../types';
import { Search, ChevronRight, Activity } from 'lucide-react';

interface DiseaseListProps {
  diseases: Disease[];
  selectedDiseaseId: number | null;
  onSelect: (id: number) => void;
}

export const DiseaseList: React.FC<DiseaseListProps> = ({
  diseases,
  selectedDiseaseId,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDiseases = useMemo(() => {
    return diseases.filter((d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [diseases, searchTerm]);

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-full md:w-80 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          病种选择
        </h2>
        <div className="mt-3 relative">
          <input
            type="text"
            placeholder="搜索病种 (如: 高血压)"
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredDiseases.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            未找到相关病种
          </div>
        ) : (
          filteredDiseases.map((disease) => (
            <button
              key={disease.id}
              onClick={() => onSelect(disease.id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group ${
                selectedDiseaseId === disease.id
                  ? 'bg-blue-50 text-blue-700 border-blue-200 border'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="line-clamp-2">{disease.name}</span>
              {selectedDiseaseId === disease.id && (
                <ChevronRight className="w-4 h-4 shrink-0 ml-2" />
              )}
            </button>
          ))
        )}
      </div>
      
      <div className="p-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400 text-center">
        共 {diseases.length} 个病种配置
      </div>
    </div>
  );
};
