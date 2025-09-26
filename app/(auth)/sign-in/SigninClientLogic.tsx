// "use client";

// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export default function SignInClientLogic() {
//   const result = useSession();
//   const status = result.status;
//   const router = useRouter();

//   useEffect(() => {
//     if (status === "authenticated") {
//       router.replace("/client/dashboard");
//     }
//   }, [status, router]);

//   if (status === "loading" || status === "authenticated") {
//     return null;
//   }

//   return null;
// }
// TO-DO: fix this
