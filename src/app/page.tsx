import { redirect } from "next/navigation";
import { getAuthData } from "@/utils/auth.utils";

export default async function Home() {
  const authData = getAuthData();
  
  if (authData) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}