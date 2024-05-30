"use client";
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth } from '@/config/FirebaseConfig';
import { toast } from 'react-toastify';
import useAuthenticated from '@/hooks/useAuthenticated';
import { useRouter } from 'next/navigation';

export default function Page() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            await createUserWithEmailAndPassword(firebaseAuth, email, password);
            console.log('User registered successfully!');
        } catch (error) {
            console.error('Error registering user:', error);
            toast.error('Error registering user');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={handleRegister}>
                    Register
                </button>
            </form>
        </div>
    );
};

