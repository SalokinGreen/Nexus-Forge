"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getSession, getUser } from "./auth";
export default function withAuth(Component) {
  return function WithAuthComponent(props) {
    const user = getUser();
    console.log("user");
    console.log(user);
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.push("/login");
      }
    }, [user, router]);

    return user ? <Component {...props} /> : null;
  };
}
