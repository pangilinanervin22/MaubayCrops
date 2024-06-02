"use client"
import { useRouter } from "next/navigation";
import MainTable, { TableStructure } from "@/components/Table/TableStructure";
import { useGetAllAccounts } from "@/hooks/Authentication";

const content: TableStructure = {
    id: "id",
    title: "Accounts",
    searchPath: "name",
    structure: [
        { label: "Name", path: "name", width: "400px", fontSize: "16px" },
        { label: "email", path: "email", width: "200px", fontSize: "16px" },
    ]
};

export default function Page() {
    // const [currentProductId, setCurrentProductId] = useState<any>("");
    const router = useRouter();
    const { accounts } = useGetAllAccounts();

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
                data={accounts}
                isEditable={false}
                structure={content}
                handleUpdate={onHandleUpdate}
                handleDelete={onHandleDelete}
                handleAdd={onHandleAdd}
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
