export class Product implements IProduct {
  _id: string;
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
}

export interface IProduct {
  _id: string;
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
