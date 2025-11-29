"use client";

import React, { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUserStore, User } from "@/app/store/useUserStore";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa6";

const GoogleAuthRedirectHandler: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useUserStore();

  const hasHandledAuth = React.useRef(false);

  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (hasHandledAuth.current) {
      if (user) {
        router.replace("/dashboard");
      }
      return;
    }

    const email = searchParams.get("email");
    const id = searchParams.get("userId");
    const role = searchParams.get("role");
    const firstName = searchParams.get("firstName");
    const lastName = searchParams.get("lastName");
    const accessToken = searchParams.get("token");
    const authError = searchParams.get("error");

    hasHandledAuth.current = true;

    if (authError) {
      // Redirect to login page or show an error state
      router.replace("/auth/login?authError=true");
      return;
    }

    // 3. Process Successful Authentication Data
    if (email && id && role && accessToken && firstName && lastName) {
      const userData: User = {
        id: id,
        email: email,
        role: role,
        firstName: firstName,
        lastName: lastName,
      };

      setUser(userData, accessToken);

      router.replace("/dashboard");
    } else if (searchParams.toString()) {
      // If parameters exist but essential ones are missing, redirect to a safe place
      toast.error("Authentication failed. Please log in again.");
      router.replace("/auth/login");
    } else {
      // If no parameters are present, this component was likely accessed directly.
      // If user is not logged in, redirect to login.
      if (!user) {
        router.replace("/auth/login");
      }
    }
  }, [searchParams, router, setUser, user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center inline-flex gap-2 items-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <FaSpinner />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Completing authentication. Redirecting...
        </p>
      </div>
    </div>
  );
};

const GoogleAuthRedirectPage = () => (
  <Suspense
    fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center inline-flex gap-2 items-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <FaSpinner />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Completing authentication. Redirecting...
          </p>
        </div>
      </div>
    }
  >
    <GoogleAuthRedirectHandler />
  </Suspense>
);

export default GoogleAuthRedirectPage;
