"use client";
import { firebaseAuth } from '@/config/FirebaseConfig';
import useAuthenticated from '@/hooks/useAuthenticated';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface LoginProps {
    // Add any props you need for the login component
}

export default function Page() {
    const router = useRouter();
    const { auth, isAuthenticated } = useAuthenticated();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleLogin = async () => {
        try {
            if (!username || !password) {
                toast.error('Please enter username and password');
                return;
            }

            if (isAuthenticated) {
                toast.error('User already logged in this session will be logged out!');
                auth.signOut();
            }
            const res = await signInWithEmailAndPassword(firebaseAuth, username, password);
            alert('User logged in successfully!');
        } catch (error) {
            alert('Error logging in:');
            toast.error('Error logging in');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form>
                <label>
                    Username:
                    <input type="text" value={username} onChange={handleUsernameChange} />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" value={password} onChange={handlePasswordChange} />
                </label>
                <br />
                <button type="button" onClick={handleLogin}>Login</button>
                <button type="button"
                    onClick={() => {
                        router.push('/register');
                    }}
                >
                    Register
                </button>
            </form>

            {
                (isAuthenticated && auth.currentUser)
                && <div>
                    <div>Logged in as {auth.currentUser.email}</div>
                    <button onClick={() => { auth.signOut(); }}>logout</button>
                </div>
            }
            <h1>wew</h1>
        </div>
    );
};

