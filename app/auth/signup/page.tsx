"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signupSchema, SignUpFormFields } from "../../schema/signup-schema";
import { GoogleSignIn } from "../GoogleSignIn";
import { useMutation } from "@tanstack/react-query";
import authService from "../../services/authService";
import { FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SignUpPage: React.FC = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<SignUpFormFields>({
    resolver: zodResolver(signupSchema),
  });

  const {
    mutate: localSignupMutate,
    isPending: localSignupIsPending,
    isSuccess: localSignupSuccess,
    error: localSignupError,
  } = useMutation({
    mutationFn: authService.register,
    onSuccess: ({ data }) => {
      console.log(data);
      toast.success("Registration successful! Please log in.");

      setInterval(() => {
        router.push("/login");
      }, 2000);
    },
    onError: (error) => {
      // @ts-ignore
      setIsLogError({ message: error.response.data.message });
      // @ts-ignore
      toast.error(error.response.data.message);
    },
    onSettled: () => {},
  });

  useEffect(() => {
    const subscription = watch((formData) => {
      console.log("Full Form State:", { values: formData, errors, isValid });
    });
    return () => subscription.unsubscribe();
  }, [watch, errors, isValid]);

  const isFormLoading = localSignupIsPending;

  const primaryError = localSignupError?.message;

  const onSubmit = (data: SignUpFormFields) => {
    localSignupMutate(data);
  };

  return (
    // Outer container: Center content vertically and horizontally
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sign Up Card Container */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl dark:bg-gray-800 dark:border dark:border-gray-700">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Create an Account
        </h2>

        {/* Global Error Message from React Query */}
        {primaryError && (
          <div
            className="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-300"
            role="alert"
          >
            {primaryError}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {/* First Name Field */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              {...register("firstName")}
              disabled={isFormLoading}
              className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
                dark:bg-gray-700 dark:border-gray-600 dark:text-white
                ${
                  errors.firstName
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }
              `}
              placeholder="John"
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-500">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name Field */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              {...register("lastName")}
              disabled={isFormLoading}
              className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
                dark:bg-gray-700 dark:border-gray-600 dark:text-white
                ${
                  errors.lastName
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }
              `}
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-500">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Email Field */}
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

          {/* Password Field */}
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
              {...register("passwordHash")}
              disabled={isFormLoading}
              className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
                dark:bg-gray-700 dark:border-gray-600 dark:text-white
                ${
                  errors.passwordHash
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }
              `}
              placeholder="••••••••"
            />
            {errors.passwordHash && (
              <p className="mt-1 text-xs text-red-500">
                {errors.passwordHash.message}
              </p>
            )}
          </div>

          <div className="w-full">
            <label htmlFor="role" className="">
              Role
            </label>
            <select
              id="role"
              className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              {...register("role", {
                required: "Role is required",
              })}
            >
              <option className="h-full text-black" value={"Candidate"}>
                Candidate
              </option>
              <option className="h-full text-black" value={"Employer"}>
                Employer
              </option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isFormLoading || !isValid}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out
              ${
                isFormLoading || !isValid
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
              }`}
          >
            {isFormLoading && localSignupIsPending ? (
              <span className="inline-flex gap-2 items-center">
                <FiLoader />
                Signing Up...
              </span>
            ) : (
              "Sign Up"
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

        {/* Google Sign-Up Button */}
        <div className="flex justify-center">
          <GoogleSignIn />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
