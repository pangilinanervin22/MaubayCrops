"use client";
import { firebaseDB } from '@/config/FirebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import React, { useEffect } from 'react'

export default function Page() {


  // useEffect(() => {
  //   populateProducts();
  // }, [])

  return (
    <div>test</div>
  )
}

import { getDocs } from 'firebase/firestore';

import { updateDoc } from 'firebase/firestore';

async function populateProducts() {
  const productsRef = collection(firebaseDB, 'products');
  const querySnapshot = await getDocs(productsRef);
  querySnapshot.forEach(async (doc) => {
    await updateDoc(doc.ref, { quantity: 5 });
  });
}