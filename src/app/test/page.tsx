"use client";
import { firebaseDB } from '@/config/FirebaseConfig';
import { productDummy } from '@/config/dummy';
import useAuthenticated from '@/hooks/useAuthenticated';
import { addDoc, collection } from 'firebase/firestore';
import React, { useEffect } from 'react'

export default function Page() {


  useEffect(() => {
    // populateProducts();
  }, [])

  return (
    <div>test</div>
  )
}


// async function populateProducts() {
//   const data = productDummy;
//   data.forEach(async (product) => {
//     await addDoc(collection(firebaseDB, "products"), product);
//   });
// }