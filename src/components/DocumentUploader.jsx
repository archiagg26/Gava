import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { documentService } from '../services/documentService';
import {
  Upload,
  FileCheck,
  AlertCircle,
  Eye,
  Trash2,
  RefreshCw,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  X
} from 'lucide-react';

export default function DocumentUploader({
  docDef,
  currentDoc,
  onUpload,
  onRemove
}) {
  const { language } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelection = async (file) => {
    if (!file) return;
    setErrorMsg(null);

    const validation = documentService.validateFile(file, docDef.id);
    if (!validation.valid) {
      setErrorMsg(validation.error);
      return;
    }

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    setUploading(true);
    try {
      await onUpload(docDef.id, file);
    } catch (e) {
      setErrorMsg('Failed to process document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const statusConfig = {
    ready: {
      label: language === 'hi' ? 'तैयार व सत्यापित' : 'Ready & Verified',
      color: 'bg-[#FFF9D6] text-[#2c3a1e] border-[#8EA66B]',
      icon: CheckCircle2,
      iconColor: 'text-[#8EA66B]'
    },
    review: {
      label: language === 'hi' ? 'जांच आवश्यक' : 'Review Needed',
      color: 'bg-[#FFDCDC] text-[#612f2f] border-[#D8A2A2]',
      icon: AlertTriangle,
      iconColor: 'text-[#914d4d]'
    },
    missing: {
      label: language === 'hi' ? 'लंबित' : 'Missing',
      color: 'bg-stone-100 text-stone-700 border-stone-200',
      icon: AlertCircle,
      iconColor: 'text-stone-400'
    }
  };

  const docStatus = currentDoc ? currentDoc.status : 'missing';
  const statusInfo = statusConfig[docStatus] || statusConfig.missing;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs hover:border-[#D8A2A2] transition-colors">
      {/* Header: Title, Category & Status */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-stone-900">
              {language === 'hi' ? docDef.nameHi : docDef.name}
            </h4>
            {docDef.mandatory && (
              <span className="text-[10px] font-bold px-2 py-0.5 bg-[#FFDCDC] text-[#612f2f] rounded-full border border-[#D8A2A2]">
                {language === 'hi' ? 'अनिवार्य' : 'Mandatory'}
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            {language === 'hi' ? docDef.descriptionHi : docDef.description}
          </p>
        </div>

        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${statusInfo.color}`}>
          <StatusIcon className={`w-3.5 h-3.5 ${statusInfo.iconColor}`} />
          <span>{statusInfo.label}</span>
        </span>
      </div>

      {/* Uploaded Document Info Card */}
      {currentDoc ? (
        <div className="mt-4 p-3 bg-[#FAF7EE] rounded-2xl border border-stone-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <FileText className="w-4 h-4 text-[#8EA66B] shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-stone-900 truncate">
                  {currentDoc.fileName}
                </p>
                <p className="text-[10px] text-stone-500">
                  {currentDoc.fileSize} • {new Date(currentDoc.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="p-1.5 text-stone-600 hover:text-[#8EA66B] hover:bg-white rounded-lg border border-transparent hover:border-stone-200 transition"
                title={language === 'hi' ? 'पूर्वावलोकन' : 'Preview'}
              >
                <Eye className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setShowAnalysisModal(true)}
                className="px-2 py-1 text-[11px] font-bold bg-white text-stone-700 hover:bg-[#FFF9D6] rounded-lg border border-stone-200 transition"
              >
                {language === 'hi' ? 'जांच देखें' : 'View Checks'}
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 text-stone-600 hover:text-[#914d4d] hover:bg-white rounded-lg border border-transparent hover:border-stone-200 transition"
                title={language === 'hi' ? 'फ़ाइल बदलें' : 'Replace File'}
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onRemove(docDef.id)}
                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                title={language === 'hi' ? 'हटाएं' : 'Remove'}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Verification Note Highlight */}
          {currentDoc.verificationNotes && (
            <div className={`p-2.5 rounded-xl text-[11px] flex items-start gap-2 ${
              currentDoc.status === 'review'
                ? 'bg-[#FFDCDC] text-[#612f2f] border border-[#D8A2A2]'
                : 'bg-[#FFF9D6] text-[#2c3a1e] border border-[#8EA66B]'
            }`}>
              {currentDoc.status === 'review' ? (
                <AlertTriangle className="w-3.5 h-3.5 text-[#914d4d] shrink-0 mt-0.5" />
              ) : (
                <FileCheck className="w-3.5 h-3.5 text-[#8EA66B] shrink-0 mt-0.5" />
              )}
              <span className="leading-snug">{currentDoc.verificationNotes}</span>
            </div>
          )}
        </div>
      ) : (
        /* Drag & Drop Dropzone */
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-4 border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-[#8EA66B] bg-[#FFF9D6]/50'
              : 'border-[#D8A2A2]/70 hover:border-[#8EA66B] bg-[#FFF9D6]/20 hover:bg-[#FFF9D6]/40'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-6 h-6 text-[#8EA66B] animate-spin mb-2" />
              <p className="text-xs font-semibold text-stone-700">
                {language === 'hi' ? 'दस्तावेज़ की सुरक्षित जांच हो रही है...' : 'Scanning document for readiness...'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF9D6] text-[#8EA66B] border border-[#D8A2A2] flex items-center justify-center mb-2">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-stone-800">
                <span className="text-[#8EA66B] font-bold underline">
                  {language === 'hi' ? 'फ़ाइल चुनें' : 'Click to upload'}
                </span>{' '}
                {language === 'hi' ? 'या यहाँ खींचें' : 'or drag and drop'}
              </p>
              <p className="text-[10px] text-stone-500 mt-1">
                PDF, JPG, PNG (Max {docDef.maxSizeMB}MB)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelection(e.target.files[0]);
          }
        }}
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
      />

      {errorMsg && (
        <div className="mt-2 text-xs text-red-600 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && currentDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl relative animate-in fade-in duration-150 border border-[#D8A2A2]">
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-stone-900 mb-1">
              {language === 'hi' ? 'दस्तावेज़ पूर्वावलोकन' : 'Document Preview'}
            </h3>
            <p className="text-xs text-stone-500 mb-4">{currentDoc.fileName}</p>

            <div className="border border-stone-200 rounded-2xl p-4 bg-[#FAF7EE] flex items-center justify-center min-h-[220px]">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={currentDoc.fileName}
                  className="max-h-72 object-contain rounded-xl"
                />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <FileText className="w-12 h-12 text-[#8EA66B] mx-auto" />
                  <p className="text-sm font-bold text-stone-800">
                    {currentDoc.fileName}
                  </p>
                  <p className="text-xs text-stone-500">
                    {language === 'hi'
                      ? 'सुरक्षित सत्र में पीडीएफ सत्यापित है।'
                      : 'Verified PDF document loaded in local session.'}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold"
              >
                {language === 'hi' ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Details Modal */}
      {showAnalysisModal && currentDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl relative border border-[#D8A2A2]">
            <button
              onClick={() => setShowAnalysisModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-stone-900 mb-1 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#8EA66B]" />
              {language === 'hi' ? 'स्वचालित जांच रिपोर्ट' : 'Automated Readiness Checks'}
            </h3>
            <p className="text-xs text-stone-500 mb-4">{currentDoc.fileName}</p>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#FAF7EE] rounded-2xl border border-stone-200">
                <span className="font-bold text-stone-800 block mb-1">
                  {language === 'hi' ? 'निकाली गई जानकारी:' : 'Extracted Field Data:'}
                </span>
                {Object.entries(currentDoc.extractedInfo || {}).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-1 border-b border-stone-200/50 last:border-0">
                    <span className="text-stone-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="font-bold text-stone-900 text-right">{val}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-[#FFF9D6] rounded-2xl border border-[#D8A2A2] text-[#612f2f]">
                <span className="font-bold block mb-1">
                  {language === 'hi' ? 'मार्गदर्शन सुझाव:' : 'Guidance Note:'}
                </span>
                <p className="leading-relaxed">{currentDoc.verificationNotes}</p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowAnalysisModal(false)}
                className="px-5 py-2.5 bg-[#8EA66B] hover:bg-[#788f57] text-[#FFF9D6] rounded-xl text-xs font-bold"
              >
                {language === 'hi' ? 'समझ गया' : 'Understood'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
