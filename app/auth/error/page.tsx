import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return params?.error ? (
    <p className="text-sm text-muted-foreground">
      Code error:{" "}
      <span className="font-medium text-destructive">{params.error}</span>
    </p>
  ) : (
    <p className="text-sm text-muted-foreground">
      An unspecified error occurred.
    </p>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  return (
    <Card className="rounded-2xl border-border/60 shadow-xl shadow-foreground/[0.06]">
      <CardHeader className="space-y-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <TriangleAlert className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </span>
        <div className="space-y-1.5">
          <CardTitle className="text-2xl tracking-tight text-foreground">
            Sorry, something went wrong.
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            We couldn&apos;t complete that request.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Suspense>
          <ErrorContent searchParams={searchParams} />
        </Suspense>
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
