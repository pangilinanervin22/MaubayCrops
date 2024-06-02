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
    receiverName: string;
    phone: string;
    province: string;
    city: string;
    barangay: string;
    landmark: string;
}

export interface CartItem extends Product {
    cartItemQuantity: number;
    productId: string;
}

