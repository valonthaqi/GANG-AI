"use client";

import { useState } from "react";
import Image from "next/image";

export default function SettingsPage() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 text-black">
      {/* Top profile section */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Image
            src="/avatar.jpg"
            alt="User"
            width={64}
            height={64}
            className="rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold">Alexa Rawles</h2>
            <p className="">alexarawles@gmail.com</p>
          </div>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
          Edit
        </button>
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <div>
          <label className="text-sm font-medium text-gray-600">Full Name</label>
          <input
            className="w-full mt-1 px-4 py-2 border rounded-md text-sm"
            placeholder="Your Full Name"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Nick Name</label>
          <input
            className="w-full mt-1 px-4 py-2 border rounded-md text-sm"
            placeholder="Your Nick Name"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Gender</label>
          <select className="w-full mt-1 px-4 py-2 border rounded-md text-sm">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            className="w-full mt-1 px-4 py-2 border rounded-md text-sm"
            placeholder="Your Email"
            defaultValue="alexarawles@gmail.com"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">
            Subscription Status
          </label>
          <input
            className="w-full mt-1 px-4 py-2 border rounded-md text-sm bg-gray-100"
            disabled
            value="Free Tier"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">
            Account Verified
          </label>
          <input
            className="w-full mt-1 px-4 py-2 border rounded-md text-sm bg-gray-100"
            disabled
            value="Yes"
          />
        </div>
      </div>

      {/* Password actions */}
      <div className="mt-8 flex flex-col md:flex-row gap-4">
        <button className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-md text-sm">
          Reset Password
        </button>
        <button className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-md text-sm">
          Change Password
        </button>
      </div>

      {/* Prompt usage */}
      <div className="mt-10">
        <h3 className="text-md font-semibold mb-1">Prompt Usage Counter</h3>
        <p className="text-sm text-gray-600">
          Prompts used today:{" "}
          <span className="font-medium text-black">7/10</span>
        </p>
      </div>

      {/* Delete account */}
      <div className="mt-10">
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="text-red-600 hover:underline text-sm font-medium"
        >
          Want to delete your account?
        </button>

        {showDeleteConfirm && (
          <div className="mt-4 border border-red-300 p-4 rounded-md bg-red-50">
            <p className="text-sm text-red-700 mb-3">
              Are you sure you want to delete your account? This action is
              irreversible.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-gray-600 px-3 py-1 border rounded-md text-sm"
              >
                Cancel
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm">
                Yes, Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
