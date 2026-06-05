import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MailCheck } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <Card className="rounded-2xl border-border/60 shadow-xl shadow-foreground/[0.06]">
      <CardHeader className="space-y-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-highlight/15 text-highlight">
          <MailCheck className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </span>
        <div className="space-y-1.5">
          <CardTitle className="text-2xl tracking-tight text-foreground">
            Thank you for signing up!
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Check your email to confirm.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm leading-relaxed text-muted-foreground">
          You&apos;ve successfully signed up. Please check your email to confirm
          your account before signing in.
        </p>
        <Link
          href="/auth/login"
          className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
        >
          Back to login
        </Link>
      </CardContent>
    </Card>
  );
}
