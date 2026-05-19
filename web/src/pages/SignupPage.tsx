import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await signup({ name, email, password });
      navigate("/");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left: brand + screenplay preview (hidden on mobile) */}
      <div className="hidden md:flex md:w-3/5 lg:w-1/2 bg-zinc-50 dark:bg-zinc-900 p-12 lg:p-16 flex-col justify-between relative overflow-hidden">
        <img
          src="/scenebook_logo.svg"
          alt="Scenebook"
          className="h-8 w-auto relative z-10"
        />

        <div className="relative z-10 max-w-md">
          <p className="font-['Courier_Prime'] text-xs uppercase tracking-widest text-muted-foreground mb-4">
            EXT. OPEN ROAD — DAWN
          </p>
          <p className="font-['Courier_Prime'] text-base leading-relaxed text-foreground/90">
            The horizon stretches forward, endless.
            <br />
            <br />
            She doesn't know where the story will end yet. That's the point.
          </p>
          <p className="font-['Courier_Prime'] text-xs uppercase tracking-widest text-muted-foreground mt-6 text-right">
            CUT TO:
          </p>
        </div>

        <p className="font-['Instrument_Serif'] text-2xl italic text-muted-foreground relative z-10">
          Your first scene is waiting.
        </p>

        <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-200/20 dark:bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      {/* Right: auth form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          <div className="md:hidden mb-8 flex justify-center">
            <img
              src="/scenebook_logo.svg"
              alt="Scenebook"
              className="h-8 w-auto"
            />
          </div>

          <div className="mb-8">
            <h1 className="font-['Instrument_Serif'] text-4xl mb-2">
              Create your account
            </h1>
            <p className="text-muted-foreground text-sm">
              Start writing in under a minute.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Jane Writer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11"
                autoComplete="name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
                autoComplete="new-password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-11"
                autoComplete="new-password"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full h-11"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-foreground font-medium hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
