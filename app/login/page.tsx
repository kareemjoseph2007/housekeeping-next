"use client";

import { useActionState } from "react";
import { login } from "../lib/auth/login";

export default function Login() {
    const [state, formAction, isPending] = useActionState(login, null);
    return (
        <div>
            <h1>Login</h1>
            <form action={formAction}>
                <input type="email" name="email" placeholder="Email" />
                <input type="password" name="password" placeholder="Password" />
                <button type="submit" disabled={isPending}>Login</button>
            </form>
            {state && <p>{state.message}</p>}
        </div>
    );
}