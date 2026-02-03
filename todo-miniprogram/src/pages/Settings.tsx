import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  Trash2,
  Info,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Todo } from '../types/todo';

export function Settings() {
  const { state, importTodos, exportTodos, dispatch } = useTodo();
  const [importStatus, setImportStatus] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // 导出待办事项
  const handleExport = () => {
    const csvContent = exportTodos();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `待办事项_${new Date().toLocaleDateString('zh-CN')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 导入待办事项
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');

        // 跳过表头，解析CSV数据
        const importedTodos: Todo[] = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // 解析CSV行
          const fields = parseCSVLine(line);

          if (fields.length >= 4) {
            const todo: Todo = {
              id: crypto.randomUUID(),
              title: fields[0],
              description: fields[1],
              isCompleted: fields[2] === '已完成',
              priority: fields[3] as 'low' | 'medium' | 'high',
              category: fields[4] || 'default',
              tags: [],
              isArchived: false,
              archivedAt: null,
              repeatType: 'none',
              repeatEndDate: null,
              dueDate: fields[5] ? new Date(fields[5]) : null,
              reminderTime: fields[6] ? new Date(fields[6]) : null,
              createdAt: fields[7] ? new Date(fields[7]) : new Date(),
              completedAt: fields[8] ? new Date(fields[8]) : null,
            };
            importedTodos.push(todo);
          }
        }

        importTodos(importedTodos);
        setImportStatus(`成功导入 ${importedTodos.length} 条待办事项`);
        setTimeout(() => setImportStatus(''), 3000);
      } catch (error) {
        setImportStatus('导入失败，请检查文件格式');
        setTimeout(() => setImportStatus(''), 3000);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // 简单的CSV行解析函数
  const parseCSVLine = (line: string): string[] => {
    const fields: string[] = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(field.trim());
        field = '';
      } else {
        field += char;
      }
    }
    fields.push(field.trim());

    return fields;
  };

  // 清除所有数据
  const handleClearData = () => {
    dispatch({ type: 'LOAD_TODOS', payload: [] });
    dispatch({ type: 'LOAD_SUMMARIES', payload: [] });
    setShowClearConfirm(false);
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-md mx-auto px-4 py-4 space-y-6">
        {/* 数据管理 */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-pink-200 to-peach-200">
              <FileText className="w-5 h-5 text-pink-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">数据管理</h2>
          </div>

          {/* 状态提示 */}
          {importStatus && (
            <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
              importStatus.includes('成功')
                ? 'bg-mint-100 text-mint-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {importStatus.includes('成功') ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {importStatus}
            </div>
          )}

          <div className="space-y-3">
            {/* 导出按钮 */}
            <button
              onClick={handleExport}
              disabled={state.todos.length === 0}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-300 to-peach-300 text-white font-medium flex items-center justify-center gap-2 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              导出为 CSV 文件
              {state.todos.length > 0 && (
                <span className="text-xs opacity-80">({state.todos.length}条)</span>
              )}
            </button>

            {/* 导入按钮 */}
            <div className="relative">
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-300 to-mint-300 text-white font-medium flex items-center justify-center gap-2 hover:shadow-md transition-all">
                <Upload className="w-4 h-4" />
                导入 CSV 文件
              </button>
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-400 text-center">
            导出后可将文件传输到其他设备，使用导入功能同步数据
          </p>
        </Card>

        {/* 清除数据 */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-red-200 to-orange-200">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">清除数据</h2>
          </div>

          {!showClearConfirm ? (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full py-3 px-4 rounded-xl bg-white/60 text-red-500 border border-red-200 font-medium flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              清除所有待办数据
            </button>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded-lg text-sm text-red-600">
                确定要清除所有待办数据吗？此操作不可恢复。
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/60 text-gray-600 font-medium hover:bg-white transition-all"
                >
                  取消
                </button>
                <button
                  onClick={handleClearData}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-400 text-white font-medium hover:bg-red-500 transition-all"
                >
                  确认清除
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* 关于 */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-sky-200 to-mint-200">
              <Info className="w-5 h-5 text-sky-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">关于</h2>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">应用名称</span>
              <span className="font-medium text-gray-800">待办事项管理</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">版本</span>
              <span className="font-medium text-gray-800">1.0.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">待办总数</span>
              <span className="font-medium text-gray-800">{state.todos.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">已完成</span>
              <span className="font-medium text-mint-600">{state.todos.filter(t => t.isCompleted).length}</span>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
