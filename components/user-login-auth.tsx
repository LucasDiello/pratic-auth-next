"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import { Icons } from "./ui/icons";
import { signIn } from "next-auth/react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

interface IUser {
  email: string;
  password: string;
}


export function UserLoginForm({ className, ...props }: UserAuthFormProps) {
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<IUser>({
        email: "",
        password: "",
    });

    async function onSubmit(event: React.SyntheticEvent) {
      event.preventDefault();
      setIsLoading(true);

      const res = await signIn("credentials", {
        ...data,
        redirect: false,
      })

      setData({
        email: "",
        password: "",
      });
      setIsLoading(false);
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = event.target;
      setData((prev) => ({ ...prev, [name]: value }));
    }

  return (
    
    <div className={cn("grid gap-6", className)}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              name="email"
              value={data.email}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="********"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              name="password"
              value={data.password}
              onChange={handleChange}
            />
        </div>
        <Button disabled={isLoading}>
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}Entrar
        </Button>
            </div>
      </form>
    </div>
  );
}
