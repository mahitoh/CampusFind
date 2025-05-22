import React, { useState } from "react";
import {
  DocumentTextIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const Reports = () => {
  const [reports, setReports] = useState([
    {
      id: 1,
      title: "Mathematics Assignment 3",
      subject: "Mathematics",
      dueDate: "2024-03-20",
      status: "pending",
      type: "Assignment",
      grade: null,
      submittedAt: null,
    },
    {
      id: 2,
      title: "Physics Lab Report",
      subject: "Physics",
      dueDate: "2024-03-15",
      status: "submitted",
      type: "Report",
      grade: "A",
      submittedAt: "2024-03-14",
    },
    {
      id: 3,
      title: "Chemistry Project",
      subject: "Chemistry",
      dueDate: "2024-03-25",
      status: "overdue",
      type: "Project",
      grade: null,
      submittedAt: null,
    },
  ]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = (reportId) => {
    setUploading(true);
    // Simulate file upload
    setTimeout(() => {
      setReports(
        reports.map((report) =>
          report.id === reportId
            ? {
                ...report,
                status: "submitted",
                submittedAt: new Date().toISOString().split("T")[0],
              }
            : report
        )
      );
      setUploading(false);
      setSelectedFile(null);
    }, 1500);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "submitted":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "submitted":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "pending":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case "overdue":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Reports & Assignments
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            View and manage your academic submissions
          </p>
        </div>

        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <DocumentTextIcon className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {report.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {report.subject} - {report.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {getStatusIcon(report.status)}
                      <span className="ml-1.5">
                        {report.status.charAt(0).toUpperCase() +
                          report.status.slice(1)}
                      </span>
                    </span>
                    {report.grade && (
                      <span className="text-lg font-semibold text-gray-900">
                        Grade: {report.grade}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {report.dueDate}
                    </p>
                  </div>
                  {report.submittedAt && (
                    <div>
                      <p className="text-sm text-gray-500">Submitted On</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {report.submittedAt}
                      </p>
                    </div>
                  )}
                </div>

                {report.status !== "submitted" && (
                  <div className="mt-4">
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-indigo-50 file:text-indigo-700
                          hover:file:bg-indigo-100"
                      />
                      <button
                        onClick={() => handleUpload(report.id)}
                        disabled={!selectedFile || uploading}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                          ${
                            !selectedFile || uploading
                              ? "bg-indigo-300 cursor-not-allowed"
                              : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          }`}
                      >
                        <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                        {uploading ? "Uploading..." : "Upload"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
