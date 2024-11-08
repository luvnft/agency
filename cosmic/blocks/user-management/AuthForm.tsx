"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/cosmic/blocks/user-management/AuthContext";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/cosmic/elements/Button";
import { Input } from "@/cosmic/elements/Input";
import { Label } from "@/cosmic/elements/Label";

interface AuthFormProps {
  type: "login" | "signup";
  onSubmit?: (data: FormData) => Promise<any>;
}

export default function AuthForm({ type, onSubmit }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      if (onSubmit) {
        const result = await onSubmit(formData);

        if (result.error) {
          throw new Error(result.error);
        }

        if (type === "login" && result.token && result.user) {
          authLogin(result.token, result.user);
          setTimeout(() => {
            router.push("/dashboard");
            router.refresh();
          }, 100);
        }
      }
    } catch (err: any) {
      console.error(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        {type === "login" ? "Login" : "Sign Up"}
      </h1>

      {type === "signup" && (
        <>
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              required
              placeholder="Enter your first name"
              autoFocus={type === "signup"}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              required
              placeholder="Enter your last name"
            />
          </div>
        </>
      )}

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          required
          placeholder="Enter your email address"
          autoFocus={type === "login"}
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          name="password"
          required
          minLength={8}
          placeholder="Enter your password"
        />
        {type === "signup" ? (
          <p className="text-sm text-gray-500 mt-1">
            Password must be at least 8 characters long and contain both letters
            and numbers
          </p>
        ) : (
          <Link
            href="/forgot-password"
            className="text-orange-600 text-sm mt-1 inline-block"
          >
            Forgot your password?
          </Link>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : type === "login" ? (
          "Login"
        ) : (
          "Sign Up"
        )}
      </Button>

      <div className="text-sm flex items-center justify-center gap-2">
        {type === "login" ? (
          <>
            <div className="flex items-center gap-2">
              Don't have an account?
              <Link href="/signup" className="text-orange-600">
                Sign up
              </Link>
            </div>
          </>
        ) : (
          <>
            Already have an account?
            <Link href="/login" className="text-orange-600">
              Login
            </Link>
          </>
        )}
      </div>
    </form>
  );
}
