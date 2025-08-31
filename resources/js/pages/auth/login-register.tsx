
import { useState } from "react";
import Login from "./login";
import Register from "./register";
import AuthLayout from "@/layouts/auth-layout";

interface LoginRegisterProps {
    status?: string;
    canResetPassword: boolean;
}

export default function LoginRegister({ status, canResetPassword }: LoginRegisterProps) {
    const [activeTab, setActiveTab] = useState("login");

    const toggleTab = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <AuthLayout title="Authentication" description="Login or Register to continue">
            <main >
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => toggleTab("login")}
                        className={`px-4 py-2 ${
                            activeTab === "login"
                                ? "bg-indigo-500 text-white"
                                : "text-indigo-500"
                        }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => toggleTab("register")}
                        className={`px-4 py-2 ${
                            activeTab === "register"
                                ? "bg-indigo-500 text-white"
                                : "text-indigo-500"
                        }`}
                    >
                        Register
                    </button>
                </div>

                {activeTab === "login" ? (
                    <Login
                        status={status}
                        canResetPassword={canResetPassword}
                    />
                ) : (
                    <Register />
                )}
            </main>
        </AuthLayout>
    );
}
