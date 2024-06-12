import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore"; // Import the 'collection' function from 'firebase/firestore'
import { toast } from "react-toastify";

import Account, { Address } from "@/interfaces/Account";
import firebaseApp, { firebaseDB } from "@/config/FirebaseConfig";

export function useAuthenticated() {
  const auth = getAuth(firebaseApp);
  const [accountId, setAccountId] = useState("");
  const [accountData, setAccountData] = useState<Account>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        // Get the account data
        const q = query(
          collection(firebaseDB, "accounts"),
          where("uid", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length > 0) {
          setAccountId(querySnapshot.docs[0].id);
          setAccountData(querySnapshot.docs[0].data() as Account);
          switch (querySnapshot.docs[0].data().userType) {
            case "Admin":
              setIsAdmin(true);
              break;
            case "Seller":
              setIsSeller(true);
              break;
            default:
              setIsAdmin(false);
              setIsSeller(false);
              break;
          }
        } else {
          setAccountId("");
          setAccountData(undefined);
          setIsAdmin(false);
        }
      } else {
        setIsAuthenticated(false);
        setAccountId("");
        setAccountData(undefined);
        setIsAdmin(false);
      }

      setIsLoading(false); // Set loading state to false
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    setIsLoading(true); // Set loading state to true

    signOut(auth)
      .then(() => {
        setAccountId("");
        setIsAdmin(false);
        setIsAuthenticated(false);
        setAccountData(undefined);
        toast.success("Successfully signed out");
      })
      .catch((error) => {
        toast.error("Error signing out:", error);
      })
      .finally(() => {
        setIsLoading(false); // Set loading state to false
      });
  };

  return {
    isAuthenticated,
    auth,
    logout,
    accountData,
    accountId,
    isLoading,
    isAdmin,
    isSeller,
  };
}

export function useLogin() {
  const auth = getAuth(firebaseApp);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true); // Set loading state to true

      const verifyEmail = await verifyEmailIsUnique(email);
      if (verifyEmail) {
        return { message: "Email is not registered" };
      }

      const res = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, message: "User logged in successfully!" };
    } catch (error) {
      console.error(error);

      return { message: "Wrong credentials" };
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  return { login, isLoading };
}

export function useRegisterAccount() {
  const auth = getAuth(firebaseApp);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const registerAccount = async (account: Account) => {
    try {
      setIsLoading(true);

      const isUnique = await verifyEmailIsUnique(account.email);
      if (!isUnique) {
        setIsRegistered(false);
        return { message: "Email is already in use" };
      }

      const res = await createUserWithEmailAndPassword(
        auth,
        account.email,
        account.password!
      );
      await addDoc(collection(firebaseDB, `/accounts`), {
        uid: res.user.uid,
        name: account.name,
        email: account.email,
        userType: account.userType,
      });

      setIsRegistered(true);
      return { success: true, message: "Successfully registered" };
    } catch (error) {
      console.error(error);
      setIsRegistered(false);
      return { message: "Error registering user" };
    } finally {
      setIsLoading(false);
    }
  };

  return { isRegistered, registerAccount, isLoading };
}

export function useModifyAccountAddress(accountId: string) {
  const [isLoading, setIsLoading] = useState(false);

  const addAccountAddress = async (address: Address) => {
    try {
      setIsLoading(true);
      // add the address
      await addDoc(
        collection(firebaseDB, `accounts/${accountId}/address`),
        address
      );
      toast.success("Address updated successfully");
      return { success: true, message: "Address updated successfully" };
    } catch (error) {
      console.error(error);
      toast.error("Error updating address");
      return { message: "Error adding address" };
    } finally {
      setIsLoading(false);
    }
  };

  const updateAccountAddress = async (address: Address) => {
    try {
      setIsLoading(true);

      // find the address
      const querySnapshot = await getDocs(
        query(
          collection(firebaseDB, `accounts/${accountId}/address`),
          where("_id", "==", address._id)
        )
      );

      if (querySnapshot.empty) {
        toast.error("Address not found");
        return { message: "Address not found" };
      }

      // update the address
      await setDoc(querySnapshot.docs[0].ref, address);

      toast.success("Address updated successfully");
      return { success: true, message: "Address updated successfully" };
    } catch (error) {
      console.error(error);
      toast.error("Error updating address");
      return { message: "Error updating address" };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccountAddress = async (addressId: string) => {
    try {
      setIsLoading(true);
      // find the address using query of address == address._id
      const querySnapshot = await getDocs(
        query(
          collection(firebaseDB, `accounts/${accountId}/address`),
          where("_id", "==", addressId)
        )
      );
      if (querySnapshot.empty) {
        toast.error("Address not found");
        return { message: "Address not found" };
      }

      // delete the address
      await deleteDoc(querySnapshot.docs[0].ref);

      toast.success("Address deleted successfully");
      return { success: true, message: "Address deleted successfully" };
    } catch (error) {
      console.error(error);
      toast.error("Error deleting address");
      return { message: "Error deleting address" };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    updateAccountAddress,
    addAccountAddress,
    deleteAccountAddress,
  };
}

export function useAccountGetAddressList(accountId: string) {
  const [addressList, setAddressList] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!accountId) return;

    const unsubscribe = onSnapshot(
      collection(firebaseDB, `accounts/${accountId}/address`),
      async (snapshot) => {
        const newAddressList = snapshot.docs.map(
          (doc) => doc.data() as Address
        );

        setAddressList(newAddressList);
        setIsLoading(false);
      }
    );

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, [accountId]); // Depend on userId so it reruns the effect when userId changes

  return { addressList, isLoading };
}

export function useGetAllAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firebaseDB, "accounts"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => doc.data() as Account);
        setAccounts(data);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { accounts, isLoading };
}

async function verifyEmailIsUnique(email: string) {
  const querySnapshot = await getDocs(
    query(collection(firebaseDB, "accounts"), where("email", "==", email))
  );
  return querySnapshot.empty;
}
