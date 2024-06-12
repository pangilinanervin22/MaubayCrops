export class Product implements IProduct {
  _id: string;
  sellerId?: string | undefined;
  sellerName?: string | undefined;
  categoryName: string;
  description: string;
  imgUrl: string;
  price: number;
  quantity: number;
  productDetails: IProductDetails;
  rating: number;
  title: string;

  constructor(
    id: string,
    sellerId: string | undefined,
    sellerName: string | undefined,
    categoryName: string,
    description: string,
    imgUrl: string,
    price: number,
    quantity: number,
    productDetails: IProductDetails,
    rating: number,
    title: string
  ) {
    this._id = id;
    this.sellerId = sellerId;
    this.sellerName = sellerName;
    this.categoryName = categoryName;
    this.description = description;
    this.imgUrl = imgUrl;
    this.price = price;
    this.quantity = quantity;
    this.productDetails = productDetails;
    this.rating = rating;
    this.title = title;
  }

  static fromFirestore(id: string, data: any): Product {
    const {
      sellerId,
      sellerName,
      categoryName,
      description,
      imgUrl,
      price,
      quantity,
      productDetails,
      rating,
      title,
    } = data;
    return new Product(
      id,
      sellerId,
      sellerName,
      categoryName,
      description,
      imgUrl,
      price,
      quantity,
      productDetails,
      rating,
      title
    );
  }

  copyWith(updatedProps: Partial<Product>): Product {
    return new Product(
      updatedProps._id ?? this._id,
      updatedProps.sellerId ?? this.sellerId,
      updatedProps.sellerName ?? this.sellerName,
      updatedProps.categoryName ?? this.categoryName,
      updatedProps.description ?? this.description,
      updatedProps.imgUrl ?? this.imgUrl,
      updatedProps.price ?? this.price,
      updatedProps.quantity ?? this.quantity,
      updatedProps.productDetails ?? this.productDetails,
      updatedProps.rating ?? this.rating,
      updatedProps.title ?? this.title
    );
  }

  toFirestore(): Omit<IProduct, "_id"> {
    return {
      sellerId: this.sellerId,
      sellerName: this.sellerName,
      categoryName: this.categoryName,
      description: this.description,
      imgUrl: this.imgUrl,
      price: this.price,
      quantity: this.quantity,
      productDetails: this.productDetails,
      rating: this.rating,
      title: this.title,
    };
  }
}

export interface IProduct {
  _id: string;
  sellerId?: string | undefined;
  sellerName?: string | undefined;
  categoryName: string;
  description: string;
  imgUrl: string;
  price: number;
  quantity: number;
  productDetails: IProductDetails;
  rating: number;
  title: string;
}

interface IProductDetails {
  Brand: string;
  Color: string;
  Material: string;
}
