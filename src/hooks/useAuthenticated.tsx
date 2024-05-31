import firebaseApp from '@/config/FirebaseConfig';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';

export default function useAuthenticated() {
    const auth = getAuth(firebaseApp);

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('User is signed in');
                setIsAuthenticated(true);
            } else {
                console.log('User is not signed in');
                setIsAuthenticated(false);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const logout = () => {
        signOut(auth)
            .then(() => {
                console.log('User is signed out');
                setIsAuthenticated(false);
            })
            .catch((error) => {
                console.log('Error signing out:', error);
            });
    };

    return { isAuthenticated, auth, logout };
}
