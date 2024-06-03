"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  useAuthenticated,
  useAccountGetAddressList,
  useModifyAccountAddress,
} from "@/hooks/Authentication";
import { useGetCartList } from "@/hooks/Cart";
import { ProductCheckout } from "@/components/ProductCheckout";
import { Address } from "@/interfaces/Account";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { AddAddressModal } from "@/components/AddAddressModal";
import { usePlaceOrder } from "@/hooks/Order";

interface AddressModalProps {
  addresses: Address[];
  onClose: () => void;
  onAddAddress: () => void;
  onDeleteAddress: (id?: string) => void;
  onEditAddress: (newAddress: Address, id?: string) => void;
  onSelectAddress: (id?: string) => void;
  selectedAddressId: string | null;
  accountId: string;
}

const AddressModal: React.FC<AddressModalProps> = ({
  addresses,
  onClose,
  onAddAddress,
  onDeleteAddress,
  onEditAddress,
  onSelectAddress,

  selectedAddressId,
  accountId,
}) => {
  const [showModal, setShowModal] = useState(false);
  const { placeOrder } = usePlaceOrder();

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setTimeout(onClose, 300); // wait for animation to finish
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center ${
        showModal ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300`}
    >
      <div
        className={`bg-white p-4 rounded shadow-lg w-3/4 md:w-1/2 lg:w-1/3 transform ${
          showModal ? "scale-100" : "scale-75"
        } transition-transform duration-300`}
      >
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
            onClick={() => {
              //TODO ORDER
              placeOrder(
                accountId,
                addresses.find((address) => address._id === selectedAddressId)!
              );
            }}
          >
            Order Now
          </button>
        ) : null}
        <button
          className="btn-green text-white py-2 px-4 rounded w-full mb-2"
          onClick={onAddAddress}
        >
          Add New Address
        </button>
        <button className="py-2 px-4 btn-light" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default function Page() {
  const router = useRouter();
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    accountId,
  } = useAuthenticated();
  const { cartList, isLoading: isCartLoading } = useGetCartList(
    accountId || "0"
  );
  const totalPrice = cartList.reduce((total, item) => {
    return total + item.price * item.cartItemQuantity;
  }, 0);
  const deliveryCharge = totalPrice > 1000 ? 0 : 100;
  const finalTotal = totalPrice + deliveryCharge;

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [editAddress, setEditAddress] = useState<Address | null>(null);
  const { addressList } = useAccountGetAddressList(accountId || "0");
  const { updateAccountAddress, deleteAccountAddress, addAccountAddress } =
    useModifyAccountAddress(accountId || "0");

  const handleAddAddress = (newAddress: Address) => {
    addAccountAddress(newAddress);
    setShowAddAddressModal(false);
    setShowAddressModal(true);
  };

  const handleDeleteAddress = (id?: string) => {
    deleteAccountAddress(id!);
  };

  const handleEditAddress = (newDetails: Address, id?: string) => {
    const addressToEdit = addressList.find((address) => address._id === id);
    console.log(addressList);
    console.log("addressToEdit", addressToEdit);
    console.log("newDetails", newDetails);

    if (addressToEdit) {
      setEditAddress(addressToEdit);
      setShowAddAddressModal(true);
    }
  };

  const handleSaveEditedAddress = (editedAddress: Address) => {
    updateAccountAddress(editedAddress);
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

  if (!isAuthenticated && !isAuthLoading) {
    router.push("/login");
  }

  if (isAuthLoading || isCartLoading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen flex flex-col bg-extra-light-green">
      <h1 className="text-center text-primary font-bold text-2xl md:text-4xl p-6">
        {cartList.length === 0 ? "Your Cart is Empty" : "Shopping Cart"}
      </h1>
      {cartList.length > 0 && (
        <article className="flex flex-col items-center p-4">
          <section className="flex flex-col bg-white p-4 shadow-md w-full md:w-2/3 lg:w-1/2">
            {cartList.map((cartItem) => (
              <ProductCheckout
                key={cartItem._id}
                product={cartItem}
                quantity={cartItem.cartItemQuantity}
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
      )}
      {showAddressModal && (
        <AddressModal
          accountId={accountId || "0"}
          addresses={addressList}
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
          showBackButton={true}
          onBack={handleBack}
          editAddress={editAddress}
        />
      )}
    </main>
  );
}
