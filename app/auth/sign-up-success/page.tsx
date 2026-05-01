import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card className="border-border/70 bg-card text-card-foreground shadow-lg shadow-foreground/5">
            <CardHeader className="space-y-2 border-l-4 border-highlight pl-5">
              <CardTitle className="text-2xl tracking-tight text-foreground">
                Thank you for signing up!
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Check your email to confirm.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You&apos;ve successfully signed up. Please check your email to
                confirm your account before signing in.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
