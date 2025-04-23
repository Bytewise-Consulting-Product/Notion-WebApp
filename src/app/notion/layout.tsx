import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AppSideBar from "@/app/pages/components/AppSideBar";
import { Separator } from "@radix-ui/react-separator";
import { Toaster } from "sonner";
import UrlBreadcrumbs from "../pages/components/UrlBreadCrumbs";
import { Suspense } from "react";

const SideBarCompomnent = () => <AppSideBar />;

export default async function NotionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarProvider>
        <SideBarCompomnent />
        <SidebarInset>
          <header className=" flex h-16 shrink-0 items-center gap-2 transition-[width, height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div
              className="flex gap-2 items-center px-4
            "
            >
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4 " />
              {/* Breadcrunmbs */}

              <Suspense>
                <UrlBreadcrumbs />
              </Suspense>
            </div>
          </header>
          <div className="w-[1400px] h-[700px] ml-5 mt-5">{children} </div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </>
  );
}
