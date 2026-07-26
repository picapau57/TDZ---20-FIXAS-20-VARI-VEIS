import React, { useState } from 'react';
import { Game } from '../types';
import { X, Copy, Download, Printer, Check } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: Game[];
  gameMode: 120 | 200;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  games,
  gameMode,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Format games text
  const formattedText = games
    .map(g => `${g.label}: ${g.numbers.join(' - ')}`)
    .join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([formattedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `TDZ_${gameMode}_jogos_pica_pau.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
              EXPORTAR JOGOS ({games.length} JOGOS)
            </h3>
            <p className="text-xs text-slate-400">
              Copie para apostar ou baixe em arquivo de texto
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Text Area Preview */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto">
          <textarea
            readOnly
            value={formattedText}
            rows={12}
            className="w-full bg-slate-950 text-amber-300 font-mono text-xs sm:text-sm p-3.5 rounded-xl border border-slate-800 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Action Buttons */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-end gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm transition active:scale-95 shadow-md"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copiado para Área de Transferência!' : 'Copiar Todos os Jogos'}</span>
          </button>

          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-700 transition active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Baixar TXT</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold px-3 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-700 transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
