import React from 'react';
import { TUTORIAL_CONTENT } from '../constants';
import { BookOpen } from 'lucide-react';

export const TutorialView: React.FC = () => {
    // A simple markdown-like parser for display
    const renderContent = (content: string) => {
        return content.split('\n').map((line, idx) => {
            if (line.startsWith('# ')) {
                return <h1 key={idx} className="text-3xl font-bold text-slate-900 dark:text-white mt-8 mb-4">{line.replace('# ', '')}</h1>;
            }
            if (line.startsWith('## ')) {
                return <h2 key={idx} className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mt-6 mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">{line.replace('## ', '')}</h2>;
            }
            if (line.startsWith('- **')) {
                const parts = line.split('**:');
                const title = parts[0].replace('- **', '');
                const rest = parts[1];
                return (
                    <li key={idx} className="ml-4 mb-2 text-slate-700 dark:text-slate-300 list-disc">
                        <strong className="text-blue-600 dark:text-blue-400 font-semibold">{title}</strong>:{rest}
                    </li>
                );
            }
             if (line.startsWith('- ')) {
                return <li key={idx} className="ml-4 mb-1 text-slate-600 dark:text-slate-400 list-disc">{line.replace('- ', '')}</li>;
            }
            if (line.trim() === '') {
                return <div key={idx} className="h-2"></div>;
            }
            return <p key={idx} className="text-slate-600 dark:text-slate-300 leading-relaxed mb-2">{line}</p>;
        });
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                    <BookOpen size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">知识库 & 教程</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">掌握指标体系的设计逻辑与使用方法</p>
                </div>
            </div>
            <div className="prose dark:prose-invert max-w-none">
                {renderContent(TUTORIAL_CONTENT)}
            </div>
        </div>
    );
};
