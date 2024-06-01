import { Product } from "./Product";

export default interface Account {
    _id?: string; // Firestore automatically generates this
    uid?: string; // For reference to authentication of Firebase
    password?: string; // For reference only, do not store in Firestore
    name: string;
    email: string;
    userType: "Farmer" | "Seller" | "Admin";
    address: Address[];
}

export interface Address {
    _id?: string;
    nameReceiver: string;
    province: string;
    city: string;
    barangay: string;
    building: string;
    phone: string;
}

export interface Wishlist {
    userId: string;
    _id?: string;
    product: Product[];
}



export interface Cart {
    userId: string;
    _id?: string;
    product: CartProduct[];
}


interface CartProduct {
    productId: string;
    quantity: number;
}