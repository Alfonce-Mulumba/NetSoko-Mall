import React from "react";

const Profile = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-green-600">My Profile</h2>
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <p>
          <span className="font-semibold">Name:</span> John Doe
        </p>
        <p>
          <span className="font-semibold">Email:</span> john@example.com
        </p>
        <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
