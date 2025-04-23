"use client";

import React, { useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useAppSelector } from "@/hooks/hooks";
import { useRouter, useSearchParams } from "next/navigation";

const UrlBreadcrumbs = React.memo(() => {
  const pages = useAppSelector((state) => state.userData.pages);
  const searchParams = useSearchParams();
  const pid = searchParams.get("pid");
  const router = useRouter();

  const page = useMemo(() => {
    return pages.find((page) => page.pid === pid);
  }, [pages, pid]);

  const handelHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push("/notion");
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={handelHomeClick}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{page?.title || ""}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
});

UrlBreadcrumbs.displayName = "UrlBreadcrumbs";

export default UrlBreadcrumbs;
