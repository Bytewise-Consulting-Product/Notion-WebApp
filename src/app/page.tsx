import { currentUser } from "@clerk/nextjs/server";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

// Dynamically import LandingPageOnSignIn with SSR enabled
const LandingPageOnSignIn = dynamic(() => import("@/app/LandingPage"), {
  ssr: true, // Disable server-side rendering
});

export default async function Page() {
  const user = await currentUser();

  if (user) {
    redirect("/notion");
  }

  return <LandingPageOnSignIn />;
}
