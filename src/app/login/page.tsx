
'use server';
import { redirect } from 'next/navigation';
import React, { useState } from 'react';

interface LoginProps {
    // Add any props you need for the login component
}

const Login: React.FC<LoginProps> = () => {


    const handleForm = async (formData: any) => {
        console.log(formData);
        // const res = await signInWithEmailAndPassword(firebaseAuth, username, password);
    };

    return (
        <div>
            <h2>Login</h2>
            <form action={handleForm}>
                <label>
                    Username:
                    <input type="text" name="username" />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" name='password' />
                </label>
                <br />
                <button type="submit">Login</button>
                <button type="button"
                    onClick={() => {
                        // Redirect to the register page
                        redirect('/register'); ``
                    }}
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default Login;