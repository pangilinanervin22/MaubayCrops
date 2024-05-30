import { firebaseAuth } from '@/config/FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';


const RegisterPage: React.FC = () => {


    const handleForm = async (formData: any) => {
        try {
            console.log(formData);

            // await createUserWithEmailAndPassword(firebaseAuth, formData.email, formData.password);
            console.log('User registered successfully!');
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form action={handleForm}>
                <label>Email:</label>
                <input
                    type="email"
                    name='email'
                />

                <label>Password:</label>
                <input type="password"
                    name='password'
                />
                <button type="submit">
                    Register
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;