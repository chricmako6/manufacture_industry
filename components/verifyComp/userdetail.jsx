'use client';

import React, { useState } from 'react';
import { FiEdit2 } from 'react-icons/fi';

export default function UserDetail() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
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
  });

  const [editData, setEditData] = useState(userData);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditData(userData);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setUserData(editData);
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
              <h1 className="text-3xl font-bold text-gray-800">Edit Personal Information</h1>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <form className="space-y-6">
              {/* Row 1: Gender and Date of Birth */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                  <input
                    type="text"
                    name="gender"
                    value={editData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date of birth</label>
                  <input
                    type="text"
                    name="dateOfBirth"
                    value={editData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Row 2: Identify Code and Hometown */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Identify code</label>
                  <input
                    type="text"
                    name="identifyCode"
                    value={editData.identifyCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hometown</label>
                  <input
                    type="text"
                    name="hometown"
                    value={editData.hometown}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Row 3: Nationality and Religion */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nationality</label>
                  <input
                    type="text"
                    name="nationality"
                    value={editData.nationality}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Religion</label>
                  <input
                    type="text"
                    name="religion"
                    value={editData.religion}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Row 4: Language and Marital Status */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
                  <input
                    type="text"
                    name="language"
                    value={editData.language}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Marital status</label>
                  <input
                    type="text"
                    name="maritalStatus"
                    value={editData.maritalStatus}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Permanent Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Permanent address</label>
                <textarea
                  name="permanentAddress"
                  value={editData.permanentAddress}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Current Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current address</label>
                <textarea
                  name="currentAddress"
                  value={editData.currentAddress}
                  onChange={handleInputChange}
                  rows="2"
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
            <h2 className="text-2xl font-bold text-gray-800">Personal information</h2>
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
            {/* Row 1: Gender and Date of Birth */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-600 font-medium">Gender</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{userData.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Date of birth</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{userData.dateOfBirth}</p>
              </div>
            </div>

            {/* Row 2: Identify Code and Hometown */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-600 font-medium">Identnify code</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{userData.identifyCode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Hometown</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{userData.hometown}</p>
              </div>
            </div>

            {/* Row 3: Nationality and Religion */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-600 font-medium">Nationality</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{userData.nationality}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Religion</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{userData.religion}</p>
              </div>
            </div>

            {/* Row 4: Language and Marital Status */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-600 font-medium">Language</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{userData.language}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Marital status</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{userData.maritalStatus}</p>
              </div>
            </div>

            {/* Permanent Address */}
            <div>
              <p className="text-sm text-gray-600 font-medium">Permanent address</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{userData.permanentAddress}</p>
            </div>

            {/* Current Address */}
            <div>
              <p className="text-sm text-gray-600 font-medium">Current address</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{userData.currentAddress}</p>
            </div>
          </div>
        </div>
      </div>
   
  );
}