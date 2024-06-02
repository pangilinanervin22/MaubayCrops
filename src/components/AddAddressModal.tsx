"use client";

import { useState } from "react";

import { Address } from "@/interfaces/Account";

interface AddAddressModalProps {
  onClose: () => void;
  onSave: (newAddress: Address) => void;
  onBack: () => void;
  editAddress?: Address | null;
  showBackButton?: boolean;
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({
  onClose,
  onSave,
  onBack,
  editAddress = null,
  showBackButton = false,
}) => {
  const [receiverName, setReceiverName] = useState(
    editAddress?.receiverName || ""
  );
  const [contact, setContact] = useState(editAddress?.phone || "");
  const [province, setProvince] = useState(editAddress?.province || "");
  const [city, setCity] = useState(editAddress?.city || "");
  const [barangay, setBarangay] = useState(editAddress?.barangay || "");
  const [landmark, setLandmark] = useState(editAddress?.landmark || "");

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    switch (id) {
      case "receiverName":
        setReceiverName(value);
        break;
      case "contact":
        setContact(value);
        break;
      case "province":
        setProvince(value);
        break;
      case "city":
        setCity(value);
        break;
      case "barangay":
        setBarangay(value);
        break;
      case "landmark":
        setLandmark(value);
        break;
    }
  };

  const handleSave = () => {
    if (editAddress) {
      const editedAddress: Address = {
        ...editAddress,
        receiverName,
        phone: contact,
        province,
        city,
        barangay,
        landmark,
      };
      onSave(editedAddress);
      return;
    }

    const newAddress: Address = {
      _id: Math.random().toString(),
      receiverName,
      phone: contact,
      province,
      city,
      barangay,
      landmark,
    };

    onSave(newAddress);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <form
        className="bg-white space-y-3 p-4 rounded shadow-lg w-3/4 md:w-1/2 lg:w-1/3"
        onSubmit={handleSave}
      >
        <h2 className="text-xl font-semibold mb-4">
          {editAddress ? "Edit Address" : "Add New Address"}
        </h2>
        <div>
          <label htmlFor="receiverName">
            Receiver Name <span className="text-red-700">*</span>
          </label>
          <input
            className="w-full input"
            id="receiverName"
            type="text"
            value={receiverName}
            required
            onChange={handleFormChange}
            placeholder="Receiver Name"
          />
        </div>
        <div>
          <label htmlFor="contact">
            Contact (11 Digits) <span className="text-red-700">*</span>
          </label>
          <input
            className="w-full input"
            id="contact"
            type="text"
            pattern="^[0-9]{11}$"
            value={contact}
            required
            onChange={handleFormChange}
            placeholder="Contact number"
          />
        </div>
        <div>
          <label htmlFor="province">
            Province <span className="text-red-700">*</span>
          </label>
          <input
            className="w-full input"
            id="province"
            type="text"
            value={province}
            required
            onChange={handleFormChange}
            placeholder="Province"
          />
        </div>
        <div>
          <label htmlFor="city">
            City <span className="text-red-700">*</span>
          </label>
          <input
            className="w-full input"
            id="city"
            type="text"
            value={city}
            required
            onChange={handleFormChange}
            placeholder="City"
          />
        </div>
        <div>
          <label htmlFor="barangay">
            Barangay <span className="text-red-700">*</span>
          </label>
          <input
            className="w-full input"
            id="barangay"
            type="text"
            value={barangay}
            onChange={handleFormChange}
            placeholder="Barangay"
          />
        </div>
        <div>
          <label htmlFor="landmark">
            Landmark <span className="text-red-700">*</span>
          </label>
          <input
            className="w-full input"
            id="landmark"
            type="text"
            value={landmark}
            required
            onChange={handleFormChange}
            placeholder="Landmark"
          />
        </div>
        <button
          className="btn-green text-white py-2 px-4 rounded w-full mb-2"
          type="submit"
        >
          {editAddress ? "Save Changes" : "Save"}
        </button>
        {showBackButton && (
          <button
            className="btn-light py-2 px-4"
            type="button"
            onClick={onBack}
          >
            Back
          </button>
        )}
        <button className="btn-light py-2 px-4" type="button" onClick={onClose}>
          Close
        </button>
      </form>
    </div>
  );
};

export { AddAddressModal };
