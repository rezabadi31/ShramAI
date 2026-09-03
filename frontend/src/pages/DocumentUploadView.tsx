import React, { useState } from 'react';
import { 
  UploadCloud, 
  CheckCircle2, 
  Loader2, 
  FileType
} from 'lucide-react';
import { ProgressBar, ProgressStep } from '../components/ProgressBar';

export const DocumentUploadView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Wage Register (Form B)');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processComplete, setProcessComplete] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const documentCategories = [
    "Wage Register (Form B)",
    "Attendance Register / Muster Roll (Form D)",
    "Employee Register (Form A)",
    "Payroll Bank Disbursement Sheet",
    "Quarterly Safety Committee Audit Log",
    "Annual Unified Statutory Return",
    "Employment Contract Sample",
    "Other Statutory Record",
  ];

  const pipelineSteps: ProgressStep[] = [
    { label: "1. File Ingestion & Antivirus Check", status: currentStepIndex > 0 ? 'complete' : currentStepIndex === 0 && isProcessing ? 'current' : 'upcoming' },
    { label: "2. Direct Digital Text Extraction", status: currentStepIndex > 1 ? 'complete' : currentStepIndex === 1 && isProcessing ? 'current' : 'upcoming' },
    { label: "3. PaddleOCR Fallback (Layout & Tables)", status: currentStepIndex > 2 ? 'complete' : currentStepIndex === 2 && isProcessing ? 'current' : 'upcoming' },
    { label: "4. Canonical Data Normalization", status: currentStepIndex > 3 ? 'complete' : currentStepIndex === 3 && isProcessing ? 'current' : 'upcoming' },
    { label: "5. Deterministic Rule & Anomaly Verification", status: currentStepIndex > 4 || processComplete ? 'complete' : currentStepIndex === 4 && isProcessing ? 'current' : 'upcoming' },
  ];

  const handleSimulatedUpload = () => {
    setIsProcessing(true);
    setProcessComplete(false);
    setCurrentStepIndex(0);

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= 4) {
          clearInterval(interval);
          setIsProcessing(false);
          setProcessComplete(true);
          return 5;
        }
        return prev + 1;
      });
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <UploadCloud className="w-6 h-6 text-emerald-400" />
            Statutory Document Ingestion & Audit Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Supports digital PDFs, scanned registers, multi-page muster rolls, and payroll sheets
          </p>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
          PaddleOCR Engine Active
        </span>
      </div>

      {/* Upload Box */}
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-6">
        
        {/* Category Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Select Statutory Register Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-medium"
          >
            {documentCategories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Drag and Drop Zone */}
        <div 
          onClick={() => {
            // Simulated file selection
            setSelectedFile(new File(["dummy content"], "ABC_Wage_Register_Oct2024.pdf", { type: "application/pdf" }));
          }}
          className="border-2 border-dashed border-slate-700 hover:border-blue-500 bg-slate-950/60 p-8 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition group"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition mb-3">
            <FileType className="w-7 h-7" />
          </div>
          <p className="text-sm font-semibold text-slate-200">
            {selectedFile ? selectedFile.name : "Click to select or drag statutory register PDF"}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Accepts PDF, Scanned PDF, PNG, JPG (up to 50MB per file)
          </p>
          {selectedFile && (
            <span className="mt-3 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
              Ready for Document AI Ingestion
            </span>
          )}
        </div>

        {/* Action Button */}
        <button
          disabled={!selectedFile || isProcessing}
          onClick={handleSimulatedUpload}
          className={`w-full py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition ${
            !selectedFile || isProcessing
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Running Document AI Extraction & Cross-Audit...</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4" />
              <span>Begin Statutory Audit Pipeline</span>
            </>
          )}
        </button>

        {/* Processing Progress Status */}
        {(isProcessing || processComplete) && (
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h3 className="text-xs font-semibold text-slate-300">Automated Pipeline Telemetry</h3>
            <ProgressBar steps={pipelineSteps} />
          </div>
        )}

        {/* Success Report */}
        {processComplete && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Document Extraction & Audit Successfully Completed</span>
            </div>
            <p className="text-slate-400">
              Document parsed with <strong className="text-white font-mono">94% OCR Confidence</strong>. 57 employee rows extracted, mapped to canonical schema, and cross-evaluated against attendance muster rolls.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
