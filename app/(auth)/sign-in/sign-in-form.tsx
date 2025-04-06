"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState, useActionState } from "react";
import { signInWithCredentials } from "@/lib/actions/user.action";

const CredentialsSignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, action, isPending] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });

  return (
    <form className="space-y-4 mt-4" action={action}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full !bg-olive-primary hover:opacity-90 !text-bold"
        disabled={isPending}
      >
        {isPending ? "Logging in..." : "Login"}
      </Button>

      {data && !data.success && (
        <div className="text-center text-destructive">{data.message}</div>
      )}
    </form>
  );
};

export default CredentialsSignInForm;
