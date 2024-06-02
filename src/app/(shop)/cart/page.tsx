"use client";

import React, { useState } from "react";
import { useAuthenticated } from "@/hooks/Authentication";
import { useRouter } from "next/navigation";
import { useGetCartList } from "@/hooks/Cart";
import { ProductCheckout } from "@/components/ProductCheckout";
import { Address } from "@/interfaces/Account";

interface AddressModalProps {
  addresses: Address[];
  onClose: () => void;
  onAddAddress: () => void;
  onDeleteAddress: (id?: string) => void;
  onEditAddress: (newAddress: Address, id?: string) => void;
  onSelectAddress: (id?: string) => void;
  selectedAddressId: string | null;
}

interface AddAddressModalProps {
  onClose: () => void;
  onSave: (newAddress: Address) => void;
  onBack: () => void;
  editAddress?: Address | null;
}

const AddressModal: React.FC<AddressModalProps> = ({
  addresses,
  onClose,
  onAddAddress,
  onDeleteAddress,
  onEditAddress,
  onSelectAddress,
  selectedAddressId,
}) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-4 rounded shadow-lg w-3/4 md:w-1/2 lg:w-1/3">
      <h2 className="text-xl font-semibold mb-4">Select Delivery Address</h2>
      <ul className="mb-4">
        {addresses.map((address) => (
          <li
            key={address._id}
            className="border p-2 mb-2 flex justify-between"
          >
            <div>
              <input
                type="radio"
                name="address"
                checked={selectedAddressId === address._id}
                onChange={() => onSelectAddress(address._id)}
              />
              <span>{address.receiverName}</span>
              <p>{address.phone}</p>
              <p>{address.province}</p>
              <p>{address.city}</p>
              <p>{address.barangay}</p>
              <p>{address.landmark}</p>
            </div>
            <div className="flex items-center">
              <button
                className="text-black py-1 px-2 rounded mr-2"
                onClick={() => onEditAddress(address, address._id)}
              >
                Edit
              </button>
              <button
                className="text-black py-1 px-2 rounded"
                onClick={() => onDeleteAddress(address._id!)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {addresses.length > 0 && selectedAddressId ? (
        <button
          className="btn-green text-white py-2 px-4 rounded w-full mb-2"
          onClick={() => {}}
        >
          Order Now
        </button>
      ) : null}
      <button
        className="btn-green  text-white py-2 px-4 rounded w-full mb-2"
        onClick={onAddAddress}
      >
        Add New Address
      </button>
      <button className="py-2 px-4 rounded w-full" onClick={onClose}>
        Close
      </button>
    </div>
  </div>
);

const AddAddressModal: React.FC<AddAddressModalProps> = ({
  onClose,
  onSave,
  onBack,
  editAddress = null,
}) => {
  const [receiverName, setReceiverName] = useState("");
  const [contact, setContact] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [barangay, setBarangay] = useState("");
  const [landmark, setLandmark] = useState("");

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
          Save Address
        </button>
        <button
          className="py-2 px-4 rounded w-full mb-2"
          type="button"
          onClick={onBack}
        >
          Back
        </button>
        <button
          className="py-2 px-4 rounded w-full"
          type="button"
          onClick={onClose}
        >
          Close
        </button>
      </form>
    </div>
  );
};

export default function Page() {
  const router = useRouter();
  const { isAuthenticated, isLoading, accountId } = useAuthenticated();
  const { cartList } = useGetCartList(accountId || "0");
  const totalPrice = cartList.reduce((total, item) => {
    return total + item.price * (item.cartItemQuantity || 1);
  }, 0);
  const deliveryCharge = totalPrice > 1000 ? 0 : 100;
  const finalTotal = totalPrice + deliveryCharge;

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [editAddress, setEditAddress] = useState<Address | null>(null);

  console.log({ addresses, selectedAddressId });

  const handleAddAddress = (newAddress: Address) => {
    // TODO: save sa firestore
    setAddresses([...addresses, newAddress]);
    setShowAddAddressModal(false);
  };

  const handleDeleteAddress = (id?: string) => {
    setAddresses(addresses.filter((address) => address._id !== id));
  };

  const handleEditAddress = (newDetails: Address, id?: string) => {
    const addressToEdit = addresses.find((address) => address._id === id);

    if (addressToEdit) {
      setEditAddress(addressToEdit);
      setShowAddAddressModal(true);
    }
  };

  const handleSaveEditedAddress = (editedAddress: Address) => {
    setAddresses(
      addresses.map((address) =>
        address._id === editedAddress._id ? editedAddress : address
      )
    );
    setShowAddAddressModal(false);
    setEditAddress(null);
  };

  const handleSelectAddress = (id?: string) => {
    if (id) {
      setSelectedAddressId(id);
    }
  };

  const handleBack = () => {
    setShowAddAddressModal(false);
    setShowAddressModal(true);
  };

  if (!isAuthenticated && !isLoading) {
    router.push("/login");
  }

  return (
    <main className="min-h-screen flex flex-col bg-extra-light-green">
      <h1 className="text-center text-primary font-bold text-2xl md:text-4xl p-6">
        {cartList.length === 0 ? "Your Cart is Empty" : "Shopping Cart"}
      </h1>
      <article className="flex flex-col items-center p-4">
        <section className="flex flex-col bg-white p-4 shadow-md w-full md:w-2/3 lg:w-1/2">
          {cartList.map((cartItem) => (
            <ProductCheckout
              key={cartItem._id}
              product={cartItem}
              quantity={cartItem.cartItemQuantity || 1}
            />
          ))}
          <section className="bg-white p-4 shadow-md w-full mt-4">
            <h4 className="text-lg font-semibold mb-2">Price Details</h4>
            <div className="flex justify-between mb-2">
              <span>Price ({cartList.length} Items)</span>
              <span>₱{totalPrice}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Delivery Charge</span>
              <span>₱{deliveryCharge}</span>
            </div>
            <div className="flex justify-between mb-4 text-xl font-bold text-green-600">
              <span>Total Amount</span>
              <span>₱{finalTotal}</span>
            </div>
            <div className="text-center text-purple-600 mb-4">
              FREE Home Delivery on orders above ₱1000
            </div>
            <button
              className="btn-green text-white py-2 px-4 rounded w-full"
              onClick={() => setShowAddressModal(true)}
            >
              PROCEED TO CHECKOUT
            </button>
          </section>
        </section>
      </article>

      {showAddressModal && (
        <AddressModal
          addresses={addresses}
          onClose={() => setShowAddressModal(false)}
          onAddAddress={() => {
            setShowAddressModal(false);
            setShowAddAddressModal(true);
          }}
          onDeleteAddress={handleDeleteAddress}
          onEditAddress={handleEditAddress}
          onSelectAddress={handleSelectAddress}
          selectedAddressId={selectedAddressId}
        />
      )}

      {showAddAddressModal && (
        <AddAddressModal
          onClose={() => {
            setShowAddAddressModal(false);
            setEditAddress(null);
          }}
          onSave={editAddress ? handleSaveEditedAddress : handleAddAddress}
          onBack={handleBack}
          editAddress={editAddress}
        />
      )}
    </main>
  );
}
