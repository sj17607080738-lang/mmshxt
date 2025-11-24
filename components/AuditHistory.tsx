import React from 'react';
import { AuditRecord } from '../types';
import { CheckCircle2, XCircle, FileText, ArrowLeft, Search } from 'lucide-react';

interface AuditHistoryProps {
  records: AuditRecord[];
  onBack: () => void;
}

export const AuditHistory: React.FC<AuditHistoryProps> = ({ records, onBack }) => {
  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      <div className="bg-white border-b border-gray-200 px-6 py-5 shadow-sm sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">审核记录档案</h1>
        </div>
        <div className="text-sm text-gray-500">
            共 {records.length} 条记录
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full">
        {records.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <FileText className="w-16 h-16 mb-4 opacity-20" />
                <p>暂无提交的审核记录</p>
            </div>
        ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-200">
                            <th className="px-6 py-4 font-semibold">申请人</th>
                            <th className="px-6 py-4 font-semibold">身份证号</th>
                            <th className="px-6 py-4 font-semibold">申请病种</th>
                            <th className="px-6 py-4 font-semibold">审核结果</th>
                            <th className="px-6 py-4 font-semibold">提交时间</th>
                            <th className="px-6 py-4 font-semibold">备注</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                        {records.map((record) => (
                            <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium">{record.applicantName}</td>
                                <td className="px-6 py-4 text-gray-500 font-mono">{record.applicantId}</td>
                                <td className="px-6 py-4">
                                    <div className="truncate max-w-[200px]" title={record.diseaseName}>
                                        {record.diseaseName}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {record.result === 'PASS' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            通过
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                            <XCircle className="w-3.5 h-3.5" />
                                            未通过
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(record.timestamp).toLocaleString('zh-CN')}
                                </td>
                                <td className="px-6 py-4 text-gray-500 italic max-w-xs truncate" title={record.notes}>
                                    {record.notes || '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
};