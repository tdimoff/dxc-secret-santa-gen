import * as XLSX from "xlsx";
import { useState, useRef } from "react";
import { generateAssignments } from "../utils/assignments";
import Modal from "./Modal";

const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [assignments, setAssignments] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File | undefined) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = new Uint8Array(evt.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const [participants, newAssignments] = generateAssignments(
            jsonData as any[]
          );
          setAssignments(newAssignments);
          setError("");
          setIsModalOpen(true);
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred");
          setAssignments([]);
          setIsModalOpen(false);
        }
      };
      reader.readAsArrayBuffer(file);
    }
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
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-8">
      <div
        className={`w-64 h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 flex flex-col items-center justify-center ${
          isDragging
            ? "border-green-500 bg-green-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <svg
          className={`w-16 h-16 mb-4 transition-colors duration-300 ${
            isDragging ? "text-green-500" : "text-gray-400"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="text-sm text-gray-600">
          Drop your Excel file here or{" "}
          <span className="text-blue-500 hover:underline">browse</span>
        </p>
        <p className="text-xs text-gray-400 mt-2">Supports .xlsx files</p>
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileUpload}
          className="hidden"
          ref={fileInputRef}
        />
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Secret Santa Assignments</h2>
        <ul className="space-y-2">
          {assignments.map((assignment, index) => (
            <li
              key={index}
              className="p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
            >
              {assignment}
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
};

export default FileUpload;
