/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const authDataStr = localStorage.getItem("authMenus");

    // Jika tidak ada authMenus, redirect ke login
    if (!authDataStr) {
      router.push("/login");
      return;
    }

    try {
      const authData = JSON.parse(authDataStr);
      const allowedPaths: string[] = authData?.map((m: any) => m.path) || [];

      // Jika path saat ini adalah /not-found, biarkan render
      if (pathname === "/not-found") {
        setIsAllowed(true);
        return;
      }

      if (allowedPaths.includes(pathname)) {
        setIsAllowed(true);
      } else {
        router.push("/not-found");
      }
    } catch (err) {
      router.push("/not-found");
    }
  }, [pathname, router]);

  if (isAllowed === null) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};
