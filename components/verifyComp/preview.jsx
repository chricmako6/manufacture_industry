'use client';

import React, { useState } from 'react';
import { FiEdit2, FiCheckCircle } from 'react-icons/fi';

export default function Preview() {
  const [isApproved, setIsApproved] = useState(false);

  const previewData = {
    personal: {
      gender: 'Female',
      dateOfBirth: '5th March, 1996',
      identifyCode: '3234611342',
      hometown: 'Hai Duong city',
      nationality: 'Vietnam',
      religion: 'None',
      language: 'Vietnamese, English',
      maritalStatus: 'Single',
      permanentAddress: '5. Nguyen Chi Thanh Street, Tan Binh Ward, Hai Duong',
      currentAddress: '29. Nguyen Ngoc Doan Street, Dong Da District, Ha Noi',
    },
    document: {
      documentType: 'National ID',
      documentNumber: '3234611342',
      issueDate: '15th March, 2015',
      expiryDate: '15th March, 2025',
      issuingAuthority: 'Ha Duong Public Security',
      issuingCountry: 'Vietnam',
      documentStatus: 'Active',
      fullName: 'Nguyen Thi Thanh',
    },
    payment: {
      cardholderName: 'John Doe',
      cardNumber: '4532 1234 5678 9010',
      expiryDate: '12/25',
      cardType: 'Visa',
      bankName: 'International Bank',
      accountType: 'Savings',
      billingAddress: '123 Main Street, New York, NY 10001',
      paymentMethod: 'Credit Card',
    },
  };

  const handleApprove = () => {
    setIsApproved(true);
    alert('All information has been verified and waiting for approval!');
  };

  const handleEdit = (section) => {
    alert(`Edit ${section} information`);
    // You can navigate to the respective edit page here
  };

  return (
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Verification Preview</h1>
          <p className="text-gray-600">Review all information before final submission</p>
        </div>

        {/* Approval Status */}
        {isApproved && (
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-6 flex items-center gap-3">
            <FiCheckCircle size={24} className="text-green-600" />
            <div>
              <p className="font-bold text-green-800">Verification Complete</p>
              <p className="text-green-700 text-sm">All information has been verified and approved successfully!</p>
            </div>
          </div>
        )}

        {/* Personal Information Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
            <button
              onClick={() => handleEdit('Personal')}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
              title="Edit"
            >
              <FiEdit2 size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-gray-600 font-medium">Gender</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{previewData.personal.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Date of Birth</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{previewData.personal.dateOfBirth}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Identify Code</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{previewData.personal.identifyCode}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Hometown</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{previewData.personal.hometown}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Nationality</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{previewData.personal.nationality}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Religion</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{previewData.personal.religion}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Language</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{previewData.personal.language}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Marital Status</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{previewData.personal.maritalStatus}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm text-gray-600 font-medium">Permanent Address</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{previewData.personal.permanentAddress}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Current Address</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{previewData.personal.currentAddress}</p>
            </div>
          </div>
        </div>

        {/* Document Information Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Document Information</h2>
            <button
              onClick={() => handleEdit('Document')}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
              title="Edit"
            >
              <FiEdit2 size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-gray-600 font-medium">Full Name</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{previewData.document.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Document Type</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{previewData.document.documentType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Document Number</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{previewData.document.documentNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Document Status</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                <span className="px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800">
                  {previewData.document.documentStatus}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Issue Date</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{previewData.document.issueDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Expiry Date</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{previewData.document.expiryDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Issuing Authority</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{previewData.document.issuingAuthority}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Issuing Country</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{previewData.document.issuingCountry}</p>
            </div>
          </div>
        </div>

        {/* Payment Information Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Payment Information</h2>
            <button
              onClick={() => handleEdit('Payment')}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
              title="Edit"
            >
              <FiEdit2 size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-gray-600 font-medium">Cardholder Name</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{previewData.payment.cardholderName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Card Type</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{previewData.payment.cardType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Card Number</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{previewData.payment.cardNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Expiry Date</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{previewData.payment.expiryDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Bank Name</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{previewData.payment.bankName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Account Type</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{previewData.payment.accountType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Payment Method</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{previewData.payment.paymentMethod}</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-600 font-medium">Billing Address</p>
            <p className="text-lg font-semibold text-gray-800 mt-1">{previewData.payment.billingAddress}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={handleApprove}
            disabled={isApproved}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <FiCheckCircle size={20} />
            {isApproved ? 'Verified & Wait for Approval' : 'Verify & Approve All'}
          </button>
          <button
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg transition"
          >
            Go Back
          </button>
        </div>

        {/* Footer Note */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-blue-700">
            📋 Please review all information carefully. Click on the edit icon next to each section to make corrections.
          </p>
        </div>
      </div>
    
  );
}