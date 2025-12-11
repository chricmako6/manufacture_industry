"use client";
import React, { useState } from "react";

function PageVerify() {
  const [step, setStep] = useState(1);

  const steps = [
    { id: 1, title: "User Details" },
    { id: 2, title: "Payment Info" },
    { id: 3, title: "Documents" },
    { id: 4, title: "Preview Form" },
  ];

  const nextStep = () => step < 4 && setStep(step + 1);
  const prevStep = () => step > 1 && setStep(step - 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#050510] to-[#020214] text-white p-6 flex flex-col items-center">

      {/* Top Profile Card */}
      <div className="w-full max-w-3xl bg-[#111118]/70 backdrop-blur-xl p-5 rounded-xl shadow-2xl border border-white/10 mb-10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-xl font-bold">
            MC
          </div>
          <div>
            <h2 className="text-lg font-semibold">mr console_log</h2>
            <p className="text-gray-400 text-sm">christophersitta06@gmail.com</p>
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-semibold mb-2">Complete Your Profile</h1>
      <p className="text-gray-400 mb-10">Fill in your information to get started</p>

      {/* Steps Card */}
      <div className="w-full max-w-3xl bg-[#111118]/60 backdrop-blur-xl p-10 rounded-2xl shadow-xl border border-white/10">

        {/* Step Navigation With Progress Lines */}
        <div className="flex items-center justify-between mb-10 relative w-full">
          {steps.map((s, index) => {
            const isCompleted = step > s.id;
            const isActive = step === s.id;
            const isPending = step < s.id;

            return (
              <div key={s.id} className="flex items-center relative">

                {/* Line Before This Step (except step 1) */}
                {index !== 0 && (
                  <div
                    className={`
                      h-1 w-24 mx-4 rounded-full transition-all duration-300
                      ${isCompleted ? "bg-green-400" : ""}
                      ${isActive ? "bg-green-400" : ""}
                      ${isPending && step < s.id ? "bg-gray-700" : ""}
                    `}
                  ></div>
                )}

                {/* Step Circle */}
                <div className="text-center">
                  <div
                    className={`
                      w-12 h-12 rounded-full border flex items-center justify-center mx-auto
                      transition-all duration-300
                      ${isCompleted ? "bg-green-500 border-green-400" : ""}
                      ${isActive ? "border-white bg-white/10" : ""}
                      ${isPending ? "border-white/10 bg-white/5" : ""}
                    `}
                  >
                    {isCompleted ? (
                      <span className="text-white text-xl">✔</span>
                    ) : (
                      <span className="text-xl text-gray-300">📄</span>
                    )}
                  </div>

                  <p className="mt-2 text-sm">STEP {s.id}</p>
                  <p className="font-semibold">{s.title}</p>

                  {isActive && <span className="text-blue-400 text-xs">In Progress</span>}
                  {isPending && <span className="text-gray-500 text-xs">Pending</span>}
                  {isCompleted && <span className="text-green-400 text-xs">Completed</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="text-center text-gray-300 mb-10">
          {step === 1 && "Step User Details content"}
          {step === 2 && "Step Payment Information content"}
          {step === 3 && "Step Documents Upload content"}
          {step === 4 && "Step Preview Form content"}
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`px-6 py-2 rounded-xl border border-white/20 ${
              step === 1
                ? "text-gray-600 border-gray-800"
                : "hover:bg-white/10"
            }`}
          >
            Previous
          </button>

          <button
            onClick={nextStep}
            disabled={step === 4}
            className={`px-6 py-2 rounded-xl bg-white/10 border border-white/20 ${
              step === 4 ? "opacity-30" : "hover:bg-white/20"
            }`}
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}

export default PageVerify;
