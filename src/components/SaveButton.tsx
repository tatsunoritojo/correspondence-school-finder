import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Loader2 } from 'lucide-react';

interface SaveButtonProps {
    targetId: string;
    fileName?: string;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ targetId, fileName = 'diagnosis-result' }) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSave = async () => {
        const element = document.getElementById(targetId);
        if (!element) return;

        setIsGenerating(true);
        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#f3f4f6', // Match bg-gray-100
            });

            const link = document.createElement('a');
            link.download = `${fileName}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Failed to generate image', error);
            alert('画像の保存に失敗しました。');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="text-center mt-6">
            <button
                onClick={handleSave}
                disabled={isGenerating}
                className="flex items-center justify-center gap-2 mx-auto bg-gray-800 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-gray-700 transition-all disabled:opacity-50"
            >
                {isGenerating ? (
                    <Loader2 className="animate-spin" size={20} />
                ) : (
                    <Download size={20} />
                )}
                {isGenerating ? '画像を生成中...' : '結果を画像で保存する'}
            </button>
            <p className="text-xs text-gray-500 mt-2">
                ※ オープンスクールの時に見返せるよう保存しましょう
            </p>
        </div>
    );
};
