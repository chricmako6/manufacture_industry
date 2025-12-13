'use client';

import React, { useState } from 'react';
import { FiEdit2 } from 'react-icons/fi';

export default function Document() {
  const [isEditing, setIsEditing] = useState(false);
  const [documentData, setDocumentData] = useState({
    documentType: 'National ID',
    documentNumber: '3234611342',
    issueDate: '15th March, 2015',
    expiryDate: '15th March, 2025',
    issuingAuthority: 'Ha Duong Public Security',
    issuingCountry: 'Vietnam',
    documentStatus: 'Active',
    fullName: 'Nguyen Thi Thanh',
    dateOfBirth: '5th March, 1996',
    placeOfIssue: 'Ha Duong City',
    documentNotes: 'Valid identification document',
  });

  const [editData, setEditData] = useState(documentData);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditData(documentData);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setDocumentData(editData);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Edit Document Information</h1>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <form className="space-y-6">
              {/* Row 1: Document Type and Document Number */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Document Type</label>
                  <input
                    type="text"
                    name="documentType"
                    value={editData.documentType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Document Number</label>
                  <input
                    type="text"
                    name="documentNumber"
                    value={editData.documentNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Row 2: Issue Date and Expiry Date */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Issue Date</label>
                  <input
                    type="text"
                    name="issueDate"
                    value={editData.issueDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={editData.expiryDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Row 3: Issuing Authority and Country */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Issuing Authority</label>
                  <input
                    type="text"
                    name="issuingAuthority"
                    value={editData.issuingAuthority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Issuing Country</label>
                  <input
                    type="text"
                    name="issuingCountry"
                    value={editData.issuingCountry}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Row 4: Place of Issue and Document Status */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Place of Issue</label>
                  <input
                    type="text"
                    name="placeOfIssue"
                    value={editData.placeOfIssue}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Document Status</label>
                  <input
                    type="text"
                    name="documentStatus"
                    value={editData.documentStatus}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Row 5: Full Name and Date of Birth */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={editData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="text"
                    name="dateOfBirth"
                    value={editData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Document Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Document Notes</label>
                <textarea
                  name="documentNotes"
                  value={editData.documentNotes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Document information</h2>
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
              title="Edit"
            >
              <FiEdit2 size={20} />
            </button>
          </div>

          {/* Information Grid */}
          <div className="space-y-6">
            {/* Row 1: Document Type and Document Number */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-600 font-medium">Document Type</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{documentData.documentType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Document Number</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{documentData.documentNumber}</p>
              </div>
            </div>

            {/* Row 2: Issue Date and Expiry Date */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-600 font-medium">Issue Date</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{documentData.issueDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Expiry Date</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{documentData.expiryDate}</p>
              </div>
            </div>

            {/* Row 3: Issuing Authority and Country */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-600 font-medium">Issuing Authority</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{documentData.issuingAuthority}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Issuing Country</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{documentData.issuingCountry}</p>
              </div>
            </div>

            {/* Row 4: Place of Issue and Document Status */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-600 font-medium">Place of Issue</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{documentData.placeOfIssue}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Document Status</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    documentData.documentStatus === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {documentData.documentStatus}
                  </span>
                </p>
              </div>
            </div>

            {/* Row 5: Full Name and Date of Birth */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-600 font-medium">Full Name</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{documentData.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Date of Birth</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{documentData.dateOfBirth}</p>
              </div>
            </div>

            {/* Document Notes */}
            <div>
              <p className="text-sm text-gray-600 font-medium">Document Notes</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{documentData.documentNotes}</p>
            </div>
          </div>
        </div>
      </div>
  
  );
}