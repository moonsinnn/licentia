"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  const handleAutoLogin = async (loginEmail: string, loginPassword: string) => {
    if (isLoading) return;

    setEmail(loginEmail);
    setPassword(loginPassword);

    // Use setTimeout to ensure the state updates before submitting
    setTimeout(() => {
      setIsLoading(true);
      setError("");

      signIn("credentials", {
        redirect: false,
        email: loginEmail,
        password: loginPassword,
      })
        .then((result) => {
          if (result?.error) {
            setError("Invalid email or password");
            setIsLoading(false);
            return;
          }

          router.push("/dashboard");
          router.refresh();
        })
        .catch((error) => {
          setError("An error occurred. Please try again.");
          console.error("Login error:", error);
          setIsLoading(false);
        });
    }, 100);
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}
      <div className="space-y-4">
        <div>
          <label htmlFor="email-address" className="sr-only">
            Email address
          </label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:bg-primary/60 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </div>
      <div className="space-y-4">
        <h3 className="text-sm font-medium">
          Demo Login Credentials{" "}
          <span className="text-xs text-muted-foreground">
            (click to auto-login)
          </span>
        </h3>
        <Card
          className="overflow-hidden cursor-pointer transition-all hover:shadow-md hover:border-primary/50 hover:bg-accent/30"
          onClick={() => handleAutoLogin("super@licenium.com", "Super@123!")}
        >
          <CardHeader className="pb-2 px-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-3.5 w-3.5 text-primary" />
                </div>
                <CardTitle className="text-sm font-medium">
                  Super Admin
                </CardTitle>
              </div>
              <div className="text-xs text-primary">Click to login →</div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pt-0 pb-4">
            <div className="space-y-1 rounded-md bg-muted/50 p-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">super@licenium.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Password:</span>
                <span className="font-medium">Super@123!</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="overflow-hidden cursor-pointer transition-all hover:shadow-md hover:border-primary/50 hover:bg-accent/30"
          onClick={() => handleAutoLogin("admin@licenium.com", "Admin@123!")}
        >
          <CardHeader className="pb-2 px-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-3.5 w-3.5 text-primary" />
                </div>
                <CardTitle className="text-sm font-medium">Admin</CardTitle>
              </div>
              <div className="text-xs text-primary">Click to login →</div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pt-0 pb-4">
            <div className="space-y-1 rounded-md bg-muted/50 p-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">admin@licenium.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Password:</span>
                <span className="font-medium">Admin@123!</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
