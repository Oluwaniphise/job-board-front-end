"use client";

import React, { Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, LoginFormFields } from "../../schema/login-schema";
import { GoogleSignIn } from "../GoogleSignIn";
import { useMutation } from "@tanstack/react-query";
import authService from "../../services/auth.service";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FiLoader } from "react-icons/fi";
import { useUserStore } from "../../store/useUserStore";
import { getAccessToken } from "@/app/utils/authUtils";

const LoginPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLogError, setIsLogError] = React.useState({
    message: "",
  });

  const { setUser } = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormFields>({
    resolver: zodResolver(loginSchema),
  });

  const {
    mutate: localLoginMutate,
    isPending: localLoginIsPending,
    isSuccess: localLoginSuccess,
    error: localLoginError,
  } = useMutation({
    mutationFn: authService.login,
    onSuccess: ({ data }) => {
      try {
        localStorage.setItem("accessToken", data.accessToken);
      } catch (error) {
        console.error(error);
      }

      setUser(data.user, data.accessToken);

      const next = searchParams.get("next");
      if (next) {
        router.push(`/${next}`);
      } else {
        router.push("/dashboard");
      }
      toast.success("Login successful!");
    },
    onError: (error) => {
      // @ts-ignore
      setIsLogError({ message: error.response.data.message });
      // @ts-ignore
      toast.error(error?.response.data.message);
    },
    onSettled: () => {},
  });

  const isFormLoading = localLoginIsPending;

  const primaryError = localLoginError?.message;

  const onSubmit = (data: LoginFormFields) => {
    localLoginMutate(data);
  };

  return (
    
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl dark:bg-gray-800 dark:border dark:border-gray-700">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Welcome Back
        </h2>

        {primaryError && (
          <div
            className="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-300"
            role="alert"
          >
            {isLogError.message}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              disabled={isFormLoading}
              className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
                dark:bg-gray-700 dark:border-gray-600 dark:text-white
                ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }
              `}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              disabled={isFormLoading}
              className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
                dark:bg-gray-700 dark:border-gray-600 dark:text-white
                ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }
              `}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isFormLoading || !isValid}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out
              ${
                isFormLoading || !isValid
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              }`}
          >
            {isFormLoading && localLoginIsPending ? (
              <span className="inline-flex gap-2 items-center">
                <FiLoader />
                Signing In...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="relative">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              OR
            </span>
          </div>
        </div>

        {/* Google Sign-In Button */}
        <div className="flex justify-center">
          <GoogleSignIn />
        </div>

        <div className="text-center text-sm text-gray-600 dark:text-gray-300">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/signup")}
            className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

const LoginPage: React.FC = () => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="inline-flex items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <FiLoader className="animate-spin" />
          <span className="text-gray-700 dark:text-gray-300">
            Loading login...
          </span>
        </div>
      </div>
    }
  >
    <LoginPageContent />
  </Suspense>
);

export default LoginPage;
