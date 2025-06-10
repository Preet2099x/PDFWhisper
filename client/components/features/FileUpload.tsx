'use client';
import * as React from 'react';
import { Upload, CheckCircle, XCircle } from 'lucide-react';

const FileUpload: React.FC = () => {
  const [uploadedFileName, setUploadedFileName] = React.useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = React.useState<boolean | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

  const uploadFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('❌ Please upload a PDF file only.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await fetch('http://localhost:8000/upload/pdf', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setUploadedFileName(file.name);
        setUploadSuccess(true);
        console.log('✅ File uploaded');
      } else {
        console.error('❌ Upload failed');
        setUploadSuccess(false);
      }
    } catch (err) {
      console.error('❌ Error uploading file:', err);
      setUploadSuccess(false);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUploadButtonClick = () => {
    const el = document.createElement('input');
    el.type = 'file';
    el.accept = 'application/pdf';
    el.onchange = () => {
      if (el.files && el.files.length > 0) {
        const file = el.files.item(0);
        if (file) uploadFile(file);
      }
    };
    el.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      uploadFile(file);
    }
  };

  return (
    <div className="w-full h-full flex flex-col px-4">
      {/* Welcome text */}
      <div className="text-center mt-12 mb-6">
        <h2 className="text-3xl font-bold text-white">Welcome to PDF RAG</h2>
        <p className="text-sm text-gray-400">Upload your PDF to begin asking questions.</p>
      </div>

      {/* Upload box */}
      <div className="flex flex-1 items-center justify-center">
        <div
          onClick={handleFileUploadButtonClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`cursor-pointer flex flex-col items-center justify-center space-y-2 p-6 rounded-2xl border border-white/10 bg-black text-white shadow-xl w-full max-w-md
            transition-all duration-300
            ${isDragging ? 'bg-white/10 border-cyan-500' : 'border-white/10'}
            ${isUploading ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          <Upload size={32} className="text-white" />
          <h3 className="text-lg font-medium">Upload PDF File</h3>
          <p className="text-xs text-gray-400 mt-1">Or drag and drop your PDF here</p>
          {isUploading && <p className="text-sm text-yellow-400 mt-2">Uploading...</p>}
        </div>
      </div>

      {/* Upload status */}
      {uploadSuccess === true && uploadedFileName && (
        <div className="flex items-center justify-center space-x-2 text-sm text-green-400 mt-4">
          <CheckCircle size={18} />
          <span>{uploadedFileName} uploaded successfully</span>
        </div>
      )}

      {uploadSuccess === false && (
        <div className="flex items-center justify-center space-x-2 text-sm text-red-400 mt-4">
          <XCircle size={18} />
          <span>Upload failed. Please try again.</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
