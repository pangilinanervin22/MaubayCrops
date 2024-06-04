"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconPencil, IconX } from "@tabler/icons-react";


import formatDate from "@/components/Table/utils/formatDate";
import {
  useAuthenticated,
  useAccountGetAddressList,
  useModifyAccountAddress,
} from "@/hooks/Authentication";
import { useGetAccountOrderList } from "@/hooks/Order";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Address } from "@/interfaces/Account";
import { AddAddressModal } from "@/components/AddAddressModal";

export default function Page() {
  const { accountId, accountData, isLoading, isAuthenticated } =
    useAuthenticated();
  const { addressList } = useAccountGetAddressList(accountId);
  const { orderList } = useGetAccountOrderList(accountId);
  const router = useRouter();
  const { addAccountAddress, updateAccountAddress, deleteAccountAddress } =
    useModifyAccountAddress(accountId);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [editAddress, setEditAddress] = useState<Address | null>(null);

  console.log({ accountData });
  const handleAddAddress = (newAddress: Address) => {
    addAccountAddress(newAddress);
    setShowAddAddressModal(false);
  };

  const handleSaveEditedAddress = (editedAddress: Address) => {
    updateAccountAddress(editedAddress);
    setShowAddAddressModal(false);
    setEditAddress(null);
  };

  if (!isAuthenticated) {
    router.push("/login");
  }

  if (isLoading) return <LoadingSpinner />;

  return (
    <main className="min-h-screen flex flex-col items-center bg-extra-light-green p-6">
      <section className="flex flex-col items-center justify-center mb-8 bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-4xl font-bold mb-4 text-blue-950">My Profile</h1>
        <Image
          className="rounded-[100%] h-40 w-40 object-cover mb-4 border-4"
          alt="Profile Image"
          src={
            "https://static.vecteezy.com/system/resources/thumbnails/022/963/918/small_2x/ai-generative-cute-cat-isolated-on-solid-background-photo.jpg"
          }
          height={200}
          width={200}
        />
        <section className="flex flex-wrap space-y-1">
          <button
            className="btn-blue w-full py-3"
            onClick={() => {
              router.push("/cart");
            }}
          >
            Go to Cart
          </button>
          <button
            className="btn-light"
            onClick={() => {
              router.push("/wishlist");
            }}
          >
            Go to Wishlists
          </button>
        </section>
      </section>

      <section className="flex flex-col items-start mb-8 bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4 text-blue-950">
          Contact Information
        </h2>
        <p className="text-gray-700 mb-2">
          <strong>Email:</strong> {accountData?.email || "No email"}
        </p>
        <p className="text-gray-700">
          {addressList.length === 0 ? (
            "No address"
          ) : (
            <>
              <strong>Phone:</strong> {addressList[0].phone || "No phone"}
            </>
          )}
        </p>
      </section>

      <section className="flex flex-col items-start mb-8 bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4 text-blue-950">Addresses</h2>
        {addressList.length > 0 && (
          <ul className="list-none grid grid-cols-1 md:grid-cols-2 gap-3 w-full text-gray-700 p-4">
            {addressList.map((address, index) => (
              <li
                key={index}
                className="mb-4 p-4 border border-gray-300 rounded-md shadow-sm relative"
              >
                <section className="flex">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      setEditAddress(address);
                      setShowAddAddressModal(true);
                    }}
                  >
                    <IconPencil stroke={1} fill="indigo" color="white" />
                  </button>
                  <button
                    className="absolute top-2 right-8 text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      let willDelete = confirm(
                        "Are you sure you want to delete this address?"
                      );

                      if (willDelete) deleteAccountAddress(address._id);
                    }}
                  >
                    <IconX stroke={1} fill="red" color="red" />
                  </button>
                </section>
                <div className="mb-2">
                  <strong className="block text-sm font-medium text-gray-900">
                    Name:
                  </strong>
                  <span className="text-sm text-gray-600">
                    {address.receiverName}
                  </span>
                </div>
                <div className="mb-2">
                  <strong className="block text-sm font-medium text-gray-900">
                    Phone:
                  </strong>
                  <span className="text-sm text-gray-600">{address.phone}</span>
                </div>
                <div className="mb-2">
                  <strong className="block text-sm font-medium text-gray-900">
                    Address:
                  </strong>
                  <span className="text-sm text-gray-600">
                    {address.province}, {address.city}, {address.barangay}
                  </span>
                </div>
                <div className="mb-2">
                  <strong className="block text-sm font-medium text-gray-900">
                    Landmark:
                  </strong>
                  <span className="text-sm text-gray-600">
                    {address.landmark}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={() => {
            setShowAddAddressModal(true);
          }}
          className="btn-blue px-3 py-1 w-40 mt-2"
        >
          Add Address
        </button>
      </section>

      <section className="flex flex-col items-start bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4 text-blue-950">
          Pending Orders
        </h2>
        <ul className="list-none list-inside w-full grid grid-cols-1 place-items-center md:grid-cols-2 lg:grid-cols-3 gap-3 text-gray-700">
          {orderList.map((order, index) => (
            <li
              key={index}
              className="mb-4 p-4 border border-gray-300 rounded-md shadow-sm"
            >
              <div className="mb-2">
                <strong className="block text-sm font-medium text-gray-900">
                  Order ID:
                </strong>
                <span className="text-sm text-gray-600">{order._id}</span>
              </div>
              <div className="mb-2">
                <strong className="block text-sm font-medium text-gray-900">
                  Order Date:
                </strong>
                <span className="text-sm text-gray-600">
                  {formatDate(order.orderDate as any)}
                </span>
              </div>
              <div className="mb-2">
                <strong className="block text-sm font-medium text-gray-900">
                  Total Items:
                </strong>
                <span className="text-sm text-gray-600">
                  {order.orderItems.length}
                </span>
              </div>
              <div className="mb-2">
                <strong className="block text-sm font-medium text-gray-900">
                  Total Price:
                </strong>
                <span className="text-sm text-gray-600">
                  ₱{order.orderTotal.toFixed(2)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {showAddAddressModal && (
        <AddAddressModal
          onClose={() => {
            setShowAddAddressModal(false);
            setEditAddress(null);
          }}
          onSave={editAddress ? handleSaveEditedAddress : handleAddAddress}
          onBack={() => {
            setShowAddAddressModal(false);
          }}
          editAddress={editAddress}
        />
      )}
    </main>
  );
}
