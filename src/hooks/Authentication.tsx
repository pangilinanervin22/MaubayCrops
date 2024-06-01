import firebaseApp, { firebaseDB } from '@/config/FirebaseConfig';
import Account, { Cart, Wishlist } from '@/interfaces/Account';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export function useAuthenticated() {
    const auth = getAuth(firebaseApp);
    const [accountId, setAccountId] = useState("");
    const [accountData, setAccountData] = useState<Account>();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsAuthenticated(true);
                // Get the account data
                const q = query(collection(firebaseDB, 'accounts'), where('uid', '==', user.uid));
                const querySnapshot = await getDocs(q);

                setAccountId(querySnapshot.docs[0].id);
                setAccountData(querySnapshot.docs[0].data() as Account);
            }
            else
                setIsAuthenticated(false);

            setIsLoading(false); // Set loading state to false
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const logout = async () => {
        setIsLoading(true); // Set loading state to true

        signOut(auth)
            .then(() => {
                toast.success('Successfully signed out');
                setIsAuthenticated(false);
            })
            .catch((error) => {
                toast.error('Error signing out:', error);
            })
            .finally(() => {
                setIsLoading(false); // Set loading state to false
            });
    };

    return { isAuthenticated, auth, logout, accountData, accountId, isLoading };
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
        }
        finally {
            setIsLoading(false); // Set loading state to false
        }
    }

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

            const res = await createUserWithEmailAndPassword(auth, account.email, account.password!);
            const user = await addDoc(collection(firebaseDB, `/accounts`), {
                uid: res.user.uid,
                name: account.name,
                email: account.email,
                userType: account.userType,
                address: [],
            });
            await addDoc(collection(firebaseDB, `/accounts/${user.id}/wishlist`), {});
            await addDoc(collection(firebaseDB, `/accounts/${user.id}/cart`), {});

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

async function verifyEmailIsUnique(email: string) {
    const querySnapshot = await getDocs(query(collection(firebaseDB, "accounts"), where("email", "==", email)));
    return querySnapshot.empty;
}


