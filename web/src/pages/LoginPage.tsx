import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login({ email, password });
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
            INT. WRITER'S ROOM — NIGHT
          </p>
          <p className="font-['Courier_Prime'] text-base leading-relaxed text-foreground/90">
            A blank page glows softly on the screen. The cursor blinks.
            <br />
            <br />
            She takes a breath, places her fingers on the keys, and begins.
          </p>
          <p className="font-['Courier_Prime'] text-xs uppercase tracking-widest text-muted-foreground mt-6 text-right">
            FADE IN.
          </p>
        </div>

        <p className="font-['Instrument_Serif'] text-2xl italic text-muted-foreground relative z-10">
          Where every story begins.
        </p>

        {/* Decorative subtle gradient blob */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-200/20 dark:bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      {/* Right: auth form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          {/* Mobile-only logo */}
          <div className="md:hidden mb-8 flex justify-center">
            <img
              src="/scenebook_logo.svg"
              alt="Scenebook"
              className="h-8 w-auto"
            />
          </div>

          <div className="mb-8">
            <h1 className="font-['Instrument_Serif'] text-4xl mb-2">
              Welcome back
            </h1>
            <p className="text-muted-foreground text-sm">
              Sign in to continue writing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                autoComplete="current-password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-foreground font-medium hover:underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
