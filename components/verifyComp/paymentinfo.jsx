'use client';

import React, { useState } from 'react';
import { FiEdit2 } from 'react-icons/fi';

export default function PaymentInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardholderName: 'John Doe',
    cardNumber: '4532 1234 5678 9010',
    expiryDate: '12/25',
    cardType: 'Visa',
    bankName: 'International Bank',
    accountType: 'Savings',
    billingAddress: '123 Main Street, New York, NY 10001',
    billingCity: 'New York',
    billingState: 'NY',
    billingZipCode: '10001',
    paymentMethod: 'Credit Card',
    currency: 'USD',
  });

  const [editData, setEditData] = useState(paymentData);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditData(paymentData);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setPaymentData(editData);
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
              <h1 className="text-3xl font-bold text-gray-800">Edit Payment Information</h1>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <form className="space-y-6">
              {/* Row 1: Cardholder Name and Card Type */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={editData.cardholderName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Card Type</label>
                  <input
                    type="text"
                    name="cardType"
                    value={editData.cardType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Row 2: Card Number and Expiry Date */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={editData.cardNumber}
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

              {/* Row 3: Bank Name and Account Type */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={editData.bankName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Account Type</label>
                  <input
                    type="text"
                    name="accountType"
                    value={editData.accountType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Row 4: Payment Method and Currency */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                  <input
                    type="text"
                    name="paymentMethod"
                    value={editData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
                  <input
                    type="text"
                    name="currency"
                    value={editData.currency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Billing Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Billing Address</label>
                <textarea
                  name="billingAddress"
                  value={editData.billingAddress}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Row 5: City, State, Zip Code */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="billingCity"
                    value={editData.billingCity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="billingState"
                    value={editData.billingState}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Zip Code</label>
                  <input
                    type="text"
                    name="billingZipCode"
                    value={editData.billingZipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
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
            <h2 className="text-2xl font-bold text-gray-800">Payment information</h2>
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
            {/* Row 1: Cardholder Name and Card Type */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-600 font-medium">Cardholder Name</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{paymentData.cardholderName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Card Type</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{paymentData.cardType}</p>
              </div>
            </div>

            {/* Row 2: Card Number and Expiry Date */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-600 font-medium">Card Number</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{paymentData.cardNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Expiry Date</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{paymentData.expiryDate}</p>
              </div>
            </div>

            {/* Row 3: Bank Name and Account Type */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-600 font-medium">Bank Name</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{paymentData.bankName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Account Type</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{paymentData.accountType}</p>
              </div>
            </div>

            {/* Row 4: Payment Method and Currency */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-600 font-medium">Payment Method</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{paymentData.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Currency</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{paymentData.currency}</p>
              </div>
            </div>

            {/* Billing Address */}
            <div>
              <p className="text-sm text-gray-600 font-medium">Billing Address</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{paymentData.billingAddress}</p>
            </div>

            {/* Row 5: City, State, Zip Code */}
            <div className="grid grid-cols-3 gap-8">
              <div>
                <p className="text-sm text-gray-600 font-medium">City</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{paymentData.billingCity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">State</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{paymentData.billingState}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Zip Code</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{paymentData.billingZipCode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
   
  );
}