import React, { useState, useEffect, useRef } from 'react';
import { 
  UploadCloud, 
  CheckCircle2, 
  Loader2, 
  FileType, 
  FileText,
  Download,
  Eye,
  X,
  Code2,
  Table as TableIcon
} from 'lucide-react';
import { ProgressBar, ProgressStep } from '../components/ProgressBar';
import { uploadDocument, fetchUploadedDocuments, fetchExtractionResult } from '../services/api';
import { DocumentRecord, DocumentIntelligenceResult } from '../types';

export const DocumentUploadView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Wage Register');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processComplete, setProcessComplete] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [uploadedDocs, setUploadedDocs] = useState<DocumentRecord[]>([]);
  const [uploadError, setUploadError] = useState('');
  const [activeInspection, setActiveInspection] = useState<DocumentIntelligenceResult | null>(null);
  const [inspectionViewMode, setInspectionViewMode] = useState<'table' | 'json'>('table');
  const [loadingInspection, setLoadingInspection] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentCategories = [
    "Wage Register",
    "Attendance Register",
    "Employee Register",
    "Payroll",
    "Safety Record",
    "Return",
    "Employment Contract",
    "Other",
  ];

  useEffect(() => {
    fetchUploadedDocuments().then(setUploadedDocs);
  }, []);

  const pipelineSteps: ProgressStep[] = [
    { label: "1. File Check & SHA-256 Checksum", status: currentStepIndex > 0 ? 'complete' : currentStepIndex === 0 && isProcessing ? 'current' : 'upcoming' },
    { label: "2. Direct Digital Text Extraction", status: currentStepIndex > 1 ? 'complete' : currentStepIndex === 1 && isProcessing ? 'current' : 'upcoming' },
    { label: "3. PaddleOCR Fallback (Layout & Tables)", status: currentStepIndex > 2 ? 'complete' : currentStepIndex === 2 && isProcessing ? 'current' : 'upcoming' },
    { label: "4. Canonical Data Normalization", status: currentStepIndex > 3 ? 'complete' : currentStepIndex === 3 && isProcessing ? 'current' : 'upcoming' },
    { label: "5. Deterministic Rule & Anomaly Verification", status: currentStepIndex > 4 || processComplete ? 'complete' : currentStepIndex === 4 && isProcessing ? 'current' : 'upcoming' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadError('');
      setProcessComplete(false);
    }
  };

  const handleUploadAndProcess = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProcessComplete(false);
    setUploadError('');
    setCurrentStepIndex(0);

    const progressTimer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < 4 ? prev + 1 : prev));
    }, 450);

    try {
      await uploadDocument(selectedFile, selectedCategory, "EST-001");
      clearInterval(progressTimer);
      setCurrentStepIndex(5);
      setIsProcessing(false);
      setProcessComplete(true);

      const updatedList = await fetchUploadedDocuments();
      setUploadedDocs(updatedList);
    } catch (err: any) {
      clearInterval(progressTimer);
      setIsProcessing(false);
      setUploadError(err.message || 'Failed to upload document');
    }
  };

  const handleInspectDocument = async (docId: string) => {
    setLoadingInspection(true);
    try {
      const result = await fetchExtractionResult(docId);
      setActiveInspection(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingInspection(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <UploadCloud className="w-6 h-6 text-emerald-400" />
            Statutory Document Ingestion & Document AI
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Direct PDF Extraction ➔ PaddleOCR Layout Analysis ➔ Structured Tabular Matrices
          </p>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
          PaddleOCR + Direct Extraction Active
        </span>
      </div>

      {/* Upload Form Box */}
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

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden"
        />

        {/* Drag and Drop Zone */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-emerald-500 bg-slate-950/60 p-8 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition group"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition mb-3">
            <FileType className="w-7 h-7" />
          </div>
          <p className="text-sm font-semibold text-slate-200">
            {selectedFile ? selectedFile.name : "Click to select or drag statutory register file"}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Accepts PDF, Scanned PDF, PNG, JPG (up to 50MB per file)
          </p>
          {selectedFile && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                {(selectedFile.size / 1024).toFixed(1)} KB • Ready for Ingestion
              </span>
            </div>
          )}
        </div>

        {uploadError && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {uploadError}
          </div>
        )}

        {/* Action Button */}
        <button
          disabled={!selectedFile || isProcessing}
          onClick={handleUploadAndProcess}
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
              <span>Document Uploaded and Ingested Successfully</span>
            </div>
            <p className="text-slate-400">
              SHA-256 Checksum recorded, stored in <code className="text-white">data/raw/EST-001/</code>, and structured for deterministic rule evaluation.
            </p>
          </div>
        )}

      </div>

      {/* Uploaded Documents History Registry */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            Uploaded Statutory Documents & Extraction Status
          </h2>
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
            {uploadedDocs.length} Total Files
          </span>
        </div>

        <div className="space-y-2.5">
          {uploadedDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-slate-700 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200">{doc.document_type}</span>
                  <span className="font-mono text-[10px] text-slate-500">({doc.id})</span>
                </div>
                <p className="font-mono text-[11px] text-slate-400 truncate max-w-sm">
                  {doc.filename}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right text-[11px] text-slate-400 font-mono">
                  <div>OCR Conf: {Math.round(doc.ocr_confidence * 100)}%</div>
                  <div className="text-emerald-400 font-semibold">{doc.status}</div>
                </div>

                <button
                  onClick={() => handleInspectDocument(doc.id)}
                  disabled={loadingInspection}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 transition text-xs font-semibold"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Tables</span>
                </button>

                <a
                  href={`/api/v1/documents/${doc.id}/download`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Download / View File"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extracted Intelligence Inspection Modal */}
      {activeInspection && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <TableIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">Extracted Document Intelligence</h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {activeInspection.extraction_method}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Doc ID: {activeInspection.document_id} • Confidence: {Math.round(activeInspection.overall_confidence * 100)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center text-xs">
                  <button
                    onClick={() => setInspectionViewMode('table')}
                    className={`px-3 py-1 rounded-lg font-semibold transition ${
                      inspectionViewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tabular Matrix
                  </button>
                  <button
                    onClick={() => setInspectionViewMode('json')}
                    className={`px-3 py-1 rounded-lg font-semibold transition ${
                      inspectionViewMode === 'json' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Structured JSON
                  </button>
                </div>

                <button
                  onClick={() => setActiveInspection(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {inspectionViewMode === 'table' ? (
                <div className="space-y-4">
                  {activeInspection.tables.map((table, tIdx) => (
                    <div key={tIdx} className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
                      <div className="p-3 bg-slate-950 border-b border-slate-800 text-xs font-bold text-slate-200 flex items-center justify-between">
                        <span>{table.table_name}</span>
                        <span className="font-mono text-slate-400 text-[11px]">{table.row_count} Rows Extracted</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
                            <tr>
                              {table.headers.map((h, hIdx) => (
                                <th key={hIdx} className="py-2.5 px-3 uppercase tracking-wider">{h}</th>
                              ))}
                              <th className="py-2.5 px-3 text-right">Provenance</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 text-slate-300">
                            {table.rows.map((r, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-900/40 font-mono text-[11px]">
                                {table.headers.map((h, cIdx) => (
                                  <td key={cIdx} className="py-2.5 px-3">
                                    {r.values[h] !== undefined && r.values[h] !== null ? String(r.values[h]) : '-'}
                                  </td>
                                ))}
                                <td className="py-2.5 px-3 text-right">
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                    P.{r.provenance.page} • {Math.round(r.provenance.confidence * 100)}%
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Normalized Canonical Entity Payload (Ready for Rule Engine & LLM RAG):</span>
                  </div>
                  <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                    {JSON.stringify(activeInspection, null, 2)}
                  </pre>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
