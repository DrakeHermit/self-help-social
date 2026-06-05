"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, KeyRound, MailCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <Card className="rounded-2xl border-border/60 shadow-xl shadow-foreground/[0.06]">
          <CardHeader className="space-y-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-highlight/15 text-highlight">
              <MailCheck className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </span>
            <div className="space-y-1.5">
              <CardTitle className="text-2xl tracking-tight text-foreground">
                Check your email
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Password reset instructions sent.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              If you registered using your email and password, you&apos;ll
              receive a reset link shortly. Be sure to check your spam folder.
            </p>
            <Link
              href="/auth/login"
              className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
            >
              Back to login
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-2xl border-border/60 shadow-xl shadow-foreground/[0.06]">
          <CardHeader className="space-y-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
              <KeyRound className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </span>
            <div className="space-y-1.5">
              <CardTitle className="text-2xl tracking-tight text-foreground">
                Reset your password
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your email and we&apos;ll send you a link to reset your
                password.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {error && (
                  <p className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  className="h-11 w-full rounded-lg text-[15px]"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send reset link"}
                </Button>
              </div>
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
                >
                  Log in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
