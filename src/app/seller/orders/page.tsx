"use client";

import { useRouter } from "next/navigation";

import formatDate from "@/components/Table/utils/formatDate";
import MainTable, { TableStructure } from "@/components/Table/TableStructure";
import { useGetOrdersBySeller } from "@/hooks/Order";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useAuthenticated } from "@/hooks/Authentication";

const content: TableStructure = {
  id: "id",
  title: "Order",
  searchPath: "orderStatus",
  structure: [
    { label: "Status", path: "orderStatus", width: "400px", fontSize: "16px" },
    {
      label: "Order Date",
      path: "orderAddress",
      width: "200px",
      fontSize: "20px",
      element: (val) => <span>{formatDate(val["orderDate"])}</span>,
    },
    { label: "Price", path: "orderTotal", width: "200px", fontSize: "16px" },
    {
      label: "Receiver",
      path: "receiver",
      width: "160px",
      fontSize: "16px",
      element: (val) => <span>{val["orderAddress"]["receiverName"]}</span>,
    },

    {
      label: "Total Items",
      path: "orderItems",
      width: "160px",
      fontSize: "16px",
      element: (val) => <span>{val["orderItems"].length}</span>,
    },
  ],
};

export default function Page() {
  const router = useRouter();
  const { accountId, isAuthenticated, isSeller } = useAuthenticated();
  const { isLoading, orders } = useGetOrdersBySeller(accountId || "0");

  if (isLoading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    router.push("/login");
  }

  if (isAuthenticated && !isSeller) {
    router.push("/");
  }

  return (
    <>
      {/* <Dialog onClose={() => { }} onOk={async () => {
                const loading = toast("Deleting product...");
                const res = await ProductDeleteAction(currentProductId)

                if (res.ok)
                    toast.update(loading, { type: "success", render: res.message });
                else if (res.error)
                    toast.update(loading, { type: "error", render: res.message });
                else
                    toast.update(loading, { type: "error", render: "Something went wrong!" });
            }}>
                <div className={style.dialog}>
                    <h4>Are you sure want to delete?</h4>
                    <p>This will product will delete. You cannot undo this action.</p>
                </div>
            </Dialog> */}
      <MainTable
        data={orders}
        isEditable={false}
        structure={content}
        handleUpdate={onHandleUpdate}
        handleDelete={onHandleDelete}
      />
    </>
  );

  function onHandleDelete(data: any) {}

  function onHandleAdd() {}

  function onHandleUpdate(data: any) {
    // router.push(`/admin/product/${data.id}`);
  }
}
