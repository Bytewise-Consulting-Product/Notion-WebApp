"use client";

import { SignedOut } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function SignedOutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure this runs only on the client
  }, [setIsClient]);

  if (!isClient) {
    return null; // Prevent rendering on the server
  }

  return <SignedOut>{children}</SignedOut>;
}
