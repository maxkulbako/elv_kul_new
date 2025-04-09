import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CredentialsSignInForm from "./sign-in-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

async function SignInPage() {
  const session = await auth();

  if (session) {
    redirect("/client/dashboard");
  }

  return (
    <Card className="w-[350px] max-w-md mx-auto shadow-olive bg-white border-olive-primary border-thin">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">ВІТАЄМО!</CardTitle>
        <CardDescription className="text-center">
          Доступ до терамедичної системи
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Вхід</TabsTrigger>
            <TabsTrigger value="register">Реєстрація</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <CredentialsSignInForm />
          </TabsContent>

          <TabsContent value="register">REGISTER</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default SignInPage;
