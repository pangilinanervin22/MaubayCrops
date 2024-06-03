"use client"
import { useRouter } from "next/navigation";
import MainTable, { TableStructure } from "@/components/Table/TableStructure";
import { useGetProducts } from "@/hooks/Products";

const content: TableStructure = {
    id: "id",
    title: "Product",
    searchPath: "name",
    structure: [
        { label: "Name", path: "title", width: "400px", fontSize: "16px" },
        { label: "Price", path: "price", width: "200px", fontSize: "16px" },
    ]
};

export default function Page() {
    // const [currentProductId, setCurrentProductId] = useState<any>("");
    const router = useRouter();
    const { products } = useGetProducts();

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
            <h1>2</h1>
            <MainTable
                data={products}
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
