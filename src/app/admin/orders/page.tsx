"use client";
import { useRouter } from "next/navigation";
import MainTable, { TableStructure } from "@/components/Table/TableStructure";
import { useGetAllOrder } from "@/hooks/Order";
import formatDate from "@/components/Table/utils/formatDate";
import { LoadingSpinner } from "@/components/LoadingSpinner";

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
  const { orders, isLoading } = useGetAllOrder();

  if (isLoading) return <LoadingSpinner />;

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

  function onHandleDelete(data: any) {
    // setCurrentProductId(data.id);
    router.push(`/admin/product?showDialog=y`);
  }

  function onHandleAdd() {
    router.push("/admin/product/create");
  }

  function onHandleUpdate(data: any) {
    router.push(`/admin/product/${data.id}`);
  }
}
