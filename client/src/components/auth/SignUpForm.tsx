import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signUpSchema,
  type SignUpForm as SignUpFormType,
} from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function SignUpForm() {
  const { signUp, isLoading } = useAuth();
  const [passwordStrength, setPasswordStrength] = useState(0);

  const form = useForm<SignUpFormType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: SignUpFormType) => {
    signUp(data.username, data.email, data.password);
  };

  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0;

    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 20;

    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 20;

    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 20;

    // Contains number
    if (/[0-9]/.test(password)) strength += 20;

    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;

    return strength;
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 40) return "bg-red-500";
    if (strength < 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="coolrapper123"
                  {...field}
                  className="bg-gray-800 border-gray-700"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="you@example.com"
                  type="email"
                  {...field}
                  className="bg-gray-800 border-gray-700"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="••••••••"
                  type="password"
                  {...field}
                  className="bg-gray-800 border-gray-700"
                  onChange={(e) => {
                    field.onChange(e);
                    setPasswordStrength(
                      calculatePasswordStrength(e.target.value),
                    );
                  }}
                />
              </FormControl>
              {field.value && (
                <div className="space-y-1">
                  <Progress
                    value={passwordStrength}
                    className={`h-2 ${getPasswordStrengthColor(passwordStrength)}`}
                  />
                  <p className="text-xs text-gray-400">
                    {passwordStrength < 40 && "Weak password"}
                    {passwordStrength >= 40 &&
                      passwordStrength < 80 &&
                      "Moderate password"}
                    {passwordStrength >= 80 && "Strong password"}
                  </p>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="mt-12 w-full bg-primary hover:bg-primary/90"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>

        <p className="text-sm text-center text-gray-400 mt-6">
          By signing up, you agree to our{" "}
          <a href="#" className="text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </p>
      </form>
    </Form>
  );
}
