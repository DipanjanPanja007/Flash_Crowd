import { useEffect, useCallback, useState, useRef } from "react";
import {
    CivicAuthProvider,
    useUser,
} from "@civic/auth/react";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../features/auth.slice.js";
import { handleLogin } from "../api/auth.js";
import Header from "../components/Header.jsx";
import { Navigate, useLocation } from "react-router";

export default function AuthContext({ children }) {
    const auth = useSelector((state) => state.authReducer.auth);
    const dispatch = useDispatch();
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const iframeContainerRef = useRef(null);
    const location = useLocation();

    const login = useCallback(async () => {
        try {
            setIsLoading(true);
            if (user) {
                const response = await handleLogin(user);
                if (response?.data?.user) {
                    dispatch(setAuth(response.data.user));
                } else {
                    console.error("Login failed:", response?.error || "Unknown error");
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [user, dispatch]);

    useEffect(() => {
        login();
    }, [login]);

    const isHomePage = location.pathname === "/";

    return (
        <div>
            <div ref={iframeContainerRef} id="civic-iframe-container" />

            <CivicAuthProvider
                clientId={import.meta.env.VITE_CIVIC_CLIENT_ID}
                displayMode="iframe"
                iframeDisplayMode="modal"
                targetContainerElement={iframeContainerRef}
            >
                <Header />

                {isLoading ? (
                    <div className="fixed top-0 left-0 flex items-center justify-center h-full w-full text-white bg-[rgba(255,255,255,0.5)]">
                        <div className="loader" />
                    </div>
                ) : isHomePage || auth ? (
                    children
                ) : (
                    <div className="fixed top-0 left-0 flex items-center justify-center h-full w-full text-white bg-[rgba(255,255,255,0.5)]">
                        <div className="loader" />
                    </div>
                )}
            </CivicAuthProvider>
        </div>
    );
}
