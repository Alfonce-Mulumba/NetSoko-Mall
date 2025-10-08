import React, { useEffect, useState } from "react";
import api from "../api";

export default function Checkout() {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    address: "",
    city: "",
    country: "",
    phone: "",
    isDefault: false,
  });
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null); // ✅ New state for selected address

  // ✅ Fetch saved addresses on mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.getAddresses();
      setAddresses(Array.isArray(res.data) ? res.data : []);
      console.log("Fetched addresses:", res.data);

      // ✅ Auto-select default address
      const defaultAddr = res.data.find((a) => a.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr.id);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  // ✅ Save address manually
  const handleSave = async () => {
    try {
      if (!form.address || !form.city || !form.country || !form.phone) {
        alert("Please fill all fields before saving.");
        return;
      }

      setLoading(true);
      await api.addAddress(form);
      setForm({
        address: "",
        city: "",
        country: "",
        phone: "",
        isDefault: false,
      });
      fetchAddresses();
      alert("Address saved successfully!");
    } catch (err) {
      console.error("Error saving address:", err);
      alert("Error saving address. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await api.setDefaultAddress(id);
      fetchAddresses();
      setSelectedAddress(id);
    } catch (err) {
      console.error("Error setting default address:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteAddress(id);
      fetchAddresses();
      if (selectedAddress === id) setSelectedAddress(null); // ✅ Unselect if deleted
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  const handleProceedToPayment = () => {
    alert("💳 Coming soon — payment integration in progress!");
  };

  return (
    <div className="min-h-screen px-6 md:px-16 py-8 bg-gray-50 dark:bg-gray-900 transition relative">
      <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Choose delivery address
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ===== Left: Saved addresses ===== */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-200">
            Your saved addresses
          </h2>
          {addresses.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No addresses saved yet.
            </p>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddress(addr.id)}
                  className={`p-3 rounded border cursor-pointer transition ${
                    selectedAddress === addr.id
                      ? "border-green-500 bg-green-50 dark:bg-green-900/30"
                      : "border-gray-300 dark:border-gray-700 hover:border-blue-400"
                  }`}
                >
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    {addr.address}, {addr.city}, {addr.country}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {addr.phone}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {!addr.isDefault && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetDefault(addr.id);
                        }}
                        className="text-blue-600 text-xs font-semibold"
                      >
                        Set as default
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(addr.id);
                      }}
                      className="text-red-500 text-xs font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== Right: Add new address ===== */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-200">
            Add address manually
          </h2>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Full address"
              className="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="City"
                className="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <input
                type="text"
                placeholder="Country"
                className="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              />
            </div>
            <input
              type="text"
              placeholder="Phone number"
              className="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) =>
                  setForm({ ...form, isDefault: e.target.checked })
                }
              />
              Set as default
            </label>
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              {loading ? "Saving..." : "Save address"}
            </button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Save default address.
          </p>
        </div>
      </div>

      {/* ===== Proceed to Payment Button ===== */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleProceedToPayment}
          disabled={!selectedAddress}
          className={`px-6 py-2 rounded font-semibold transition ${
            selectedAddress
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
          title={!selectedAddress ? "Select an address to proceed" : ""}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
