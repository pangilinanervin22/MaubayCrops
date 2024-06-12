import { useState, useEffect, FormEvent } from "react";
import { toast } from "react-toastify";

import { useAddSellerProduct } from "@/hooks/Products";
import { Product } from "@/interfaces/Product";

interface AddProductModalProps {
  onClose: () => void;
  onSave: (newProduct: Product) => void;
  editProduct?: Product | null;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  onClose,
  onSave,
  editProduct = null,
}) => {
  const [title, setTitle] = useState(editProduct?.title || "");
  const [categoryName, setCategoryName] = useState(
    editProduct?.categoryName || ""
  );
  const [description, setDescription] = useState(
    editProduct?.description || ""
  );
  const [image, setImage] = useState<File | null>(null);
  const [price, setPrice] = useState(editProduct?.price || 1);
  const [quantity, setQuantity] = useState(editProduct?.quantity || 1);
  const [brand, setBrand] = useState(editProduct?.productDetails.Brand || "");
  const [material, setMaterial] = useState(
    editProduct?.productDetails.Material || ""
  );
  const [color, setColor] = useState(editProduct?.productDetails.Color || "");
  const { uploadImage, deleteImage } = useAddSellerProduct();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    switch (id) {
      case "title":
        setTitle(value);
        break;
      case "categoryName":
        setCategoryName(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "price":
        setPrice(parseFloat(value));
        break;
      case "quantity":
        setQuantity(parseInt(value));
        break;
      case "brand":
        setBrand(value);
        break;
      case "material":
        setMaterial(value);
        break;
      case "color":
        setColor(value);
        break;
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editProduct) {
      console.log({ editProduct, typeOf: typeof editProduct });
      let imgUrl: string | undefined;

      if (image) {
        if (editProduct.imgUrl) {
          await deleteImage(editProduct.imgUrl);
        }

        imgUrl = (
          await uploadImage(
            image as File,
            title.replace(/\s+/g, "_").toLowerCase()
          )
        ).downloadURL;
      }

      const editedProduct = editProduct.copyWith({
        title,
        categoryName,
        description,
        imgUrl,
        price,
        quantity,
        productDetails: {
          Brand: brand,
          Material: material,
          Color: color,
        },
      });
      onSave(editedProduct);
      return;
    }

    const res = await uploadImage(
      image as File,
      title.replace(/\s+/g, "_").toLowerCase()
    );

    if (!res.success) {
      toast.error(res.error);
      return;
    }

    const newProduct = new Product(
      Math.random().toString(),
      undefined,
      undefined,
      categoryName,
      description,
      res.downloadURL,
      price,
      quantity,
      {
        Brand: brand,
        Material: material,
        Color: color,
      },
      5.0,
      title
    );

    onSave(newProduct);
  };

  const handleClose = () => {
    setShowModal(false);
    setTimeout(onClose, 300); // wait for animation to finish
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4 ${
        showModal ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300`}
    >
      <form
        className={`bg-white space-y-3 p-4 rounded shadow-lg w-3/4 md:w-1/2 lg:w-1/3 transform h-full overflow-y-scroll ${
          showModal ? "scale-100" : "scale-75"
        } transition-transform duration-300`}
        onSubmit={handleSave}
      >
        <h2 className="text-xl font-semibold mb-4">
          {editProduct ? "Edit Product" : "Add New Product"}
        </h2>
        <div>
          <label htmlFor="title">
            Title <span className="text-red-700">*</span>
          </label>
          <input
            className="w-full input"
            id="title"
            type="text"
            value={title}
            required
            onChange={handleFormChange}
            placeholder="Product Title"
          />
        </div>
        <div>
          <label htmlFor="categoryName">
            Category Name <span className="text-red-700">*</span>
          </label>
          <input
            className="w-full input"
            id="categoryName"
            type="text"
            value={categoryName}
            required
            onChange={handleFormChange}
            placeholder="Category Name"
          />
        </div>
        <div>
          <label htmlFor="description">
            Description <span className="text-red-700">*</span>
          </label>
          <textarea
            className="w-full input"
            id="description"
            value={description}
            required
            onChange={handleFormChange}
            placeholder="Product Description"
          />
        </div>
        <div>
          <label htmlFor="image">
            Product Image <span className="text-red-700">*</span>
          </label>
          <input
            className="w-full input"
            id="image"
            type="file"
            accept="image/*"
            required={editProduct ? false : true}
            onChange={handleImageChange}
          />
        </div>
        <div>
          <label htmlFor="price">
            Price <span className="text-red-700">*</span>
          </label>
          <input
            className="w-full input"
            id="price"
            type="number"
            value={price}
            min={1}
            required
            onChange={handleFormChange}
            placeholder="Product Price"
          />
        </div>
        <div>
          <label htmlFor="quantity">
            Quantity <span className="text-red-700">*</span>
          </label>
          <input
            className="w-full input"
            id="quantity"
            type="number"
            value={quantity}
            min={1}
            required
            onChange={handleFormChange}
            placeholder="Product Quantity"
          />
        </div>
        <div>
          <label htmlFor="brand">
            Brand <span className="text-red-700">*</span>
          </label>
          <input
            className="w-full input"
            id="brand"
            type="text"
            value={brand}
            required
            onChange={handleFormChange}
            placeholder="Brand"
          />
        </div>
        <div>
          <label htmlFor="material">
            Material <span className="text-red-700">*</span>
          </label>
          <input
            className="w-full input"
            id="material"
            type="text"
            value={material}
            required
            onChange={handleFormChange}
            placeholder="Material"
          />
        </div>
        <div>
          <label htmlFor="color">
            Color <span className="text-red-700">*</span>
          </label>
          <input
            className="w-full input"
            id="color"
            type="text"
            value={color}
            required
            onChange={handleFormChange}
            placeholder="Color"
          />
        </div>
        <button
          className="btn-blue text-white py-2 px-4 rounded w-full mb-2"
          type="submit"
        >
          {editProduct ? "Save Changes" : "Save"}
        </button>
        <button
          className="btn-light py-2 px-4"
          type="button"
          onClick={handleClose}
        >
          Close
        </button>
      </form>
    </div>
  );
};

export { AddProductModal };
