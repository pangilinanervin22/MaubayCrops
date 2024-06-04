"use client";
import { firebaseDB } from "@/config/FirebaseConfig";
import { addDoc, collection, deleteDoc } from "firebase/firestore";
import React, { useEffect } from "react";

export default function Page() {
  const fertilizers: Product[] = [
    {
      _id: "w1zV3ayR13",
      title:
        "TrustBasket Organic Vermicompost Fertilizer Manure for Plants(5KG)",
      imgUrl: "https://m.media-amazon.com/images/I/71iPA5LfB7L._AC_UL320_.jpg",
      price: 599,
      categoryName: "Fertilizers",
      description: `1. 100% organic
      2. Improves soil aeration
      3. Enriches soil with micro-organisms (adding enzymes such as phosphate and cellulose)
      4. Microbial activity in worm castings is 10 to 20 times higher than in the soil and organic matter that the worm ingests
      5. Attracts deep-burrowing earthworms already present in the soil.
      6. Increases the immune system of plants.
      7. Easy to store and easy to use.`,
      quantity: 5,
      rating: 4.2,
      productDetails: {
        Brand: "TrustBasket",
        Material: "Organic",
        Color: "Brown",
      },
    },
    {
      _id: "w1zV3ayR14",
      title:
        "TrustBasket Enriched Organic Earth Magic Potting Soil Fertilizer for Plants(5KG)",
      imgUrl: "https://m.media-amazon.com/images/I/61fUoGkNdHL._AC_UL320_.jpg",
      price: 799,
      categoryName: "Fertilizers",
      description: `Contains microbes which enhance the soil properties
      Completely organic and does not contain any harmful chemicals
      Contains micro and macro nutrients. Has good water holding capacity
      Its antifungal property helps the plants to grow healthy`,
      quantity: 5,
      rating: 4.5,
      productDetails: {
        Brand: "TrustBasket",
        Material: "Organic",
        Color: "Brown",
      },
    },
    {
      _id: "w1zV3ayR15",
      title:
        "Katra Fertilizers Lysorus (1 g+50 ml) Anti-Virus and Bacteria Virucide for Virus Control",
      imgUrl: "https://m.media-amazon.com/images/I/81ZCu2bU-+L._AC_UY218_.jpg",
      price: 899,
      categoryName: "Fertilizers",
      description: `Lysorus (Anti-virus & bacteria) is an multi purpose enzyme which protect plants from bacteria and virus, it is capable of breaking the chemical bonds of the outer cell wall of the bacteria and virus.
      Lysorus has true activity against bacteria and virus leading to long term protection of crop from bacterial and viral infection.
      Lysorus is 100% toxic free product. Its uses is environmentally safe.
      Doses : 1gm lysorus powder + 50 ml activator / acer Method of application :
      First dissolve 1gm lysorus powder then mix 50 ml Activator into 150 ltr water then spray it on crop of 1 acre.
      Doses: 1 Pack is Sufficient for 10-time use in 1 Ltr water. Method of Application:-Mix .1gm Powder with 5ml activator(which is already given in the pack) in 1 Ltr. water and spray freely on the plant, Shake well before use.`,
      quantity: 5,
      rating: 4.9,
      productDetails: {
        Brand: "Katra Fertilizers",
        Material: "Organic",
        Color: "White",
      },
    },
  ];

  useEffect(() => {
    // deleteAllProducts();
    // populateProducts(fertilizers);
  }, []);

  return <div>test</div>;
}

import { getDocs } from "firebase/firestore";

import { updateDoc } from "firebase/firestore";
import { Product } from "@/interfaces/Product";

async function populateProducts(products: Product[]) {
  const productsRef = collection(firebaseDB, "products");
  const querySnapshot = await getDocs(productsRef);
  // querySnapshot.forEach(async (doc) => {
  //   await updateDoc(doc.ref, { quantity: 5 });
  // });

  // add all products to the database
  products.forEach(async (product) => {
    await addDoc(productsRef, product);
  });
}

async function deleteAllProducts() {
  const productsRef = collection(firebaseDB, "products");
  const querySnapshot = await getDocs(productsRef);
  querySnapshot.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });
}
