"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  AudioWaveform,
  BadgeCheck,
  BadgePlus,
  Bell,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  FileX,
  GalleryVerticalEnd,
  LogOut,
  Plus,
  Sparkles,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";

import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  PagesTypes,
  setContents,
  setNewPage,
  setPages,
  setUpdatePage,
  setUser,
  UserTypes,
} from "@/store/features/UserDataSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useRouter } from "next/navigation";

// SideBar Component
export default function AppSideBar() {
  // const [pages, setPages] =
  // useState<{ name: string; items: { title: string; url: string }[] }[]>();
  const [loading, setLoading] = useState(false); // spiner
  const { user } = useUser();
  const dispatch = useAppDispatch();

  const pages = {
    items: [
      {
        name: "Private",
        items: [
          {
            title: "Personal Notes",
            url: "01f07170-1951-4fa6-b04a-54878de48ccc",
          },
          {
            title: "Project Ideas",
            url: "3741c85b-339e-4822-8fd8-82f690af8417",
          },
        ],
      },
      {
        name: "Favourite",
        items: [
          { title: "Inspiration Board", url: "/favourite/inspiration" },
          { title: "Top Articles", url: "/favourite/articles" },
        ],
      },
    ],
  };

  const WorkSpace = {
    workspace: [
      {
        name: "Sourav",
        logo: GalleryVerticalEnd,
        plan: "Free",
      },
      { name: "SUBH", logo: AudioWaveform, plan: "free" },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
  };

  // Dispatch the User Details properly
  useEffect(() => {
    // Getting the User Details
    const userDetails: UserTypes = {
      uid: user?.id || "",
      name: user?.fullName || "",
      email: user?.emailAddresses[0]?.emailAddress || "",
      image: user?.imageUrl || "",
    };

    if (user?.id != null) {
      dispatch(setUser(userDetails));
    }
  }, [user, dispatch]);

  // fetch the data
  const getData = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      const response = await axios.post(
        "/api/pages-created",
        {
          email: user?.emailAddresses[0].emailAddress,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log(response);

      dispatch(setPages(response.data.data.pages));
      dispatch(setContents(response.data.data.contents));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, dispatch]);

  useEffect(() => {
    setLoading(true);
    getData();
  }, [user, getData]);

  if (loading) {
    return <MySideBarSkeleton />;
  }

  return (
    <Sidebar
      collapsible="icon"
      variant="floating"
      className="flex flex-col h-full"
    >
      <SidebarHeader>
        <NavWorkSpaceSwitcher workspace={WorkSpace.workspace} />
      </SidebarHeader>
      <SidebarContent className="flex-grow overflow-y-auto">
        {!pages ? (
          <div className=""></div>
        ) : (
          // <div className="p-4 text-gray-600">Loading...</div>
          <Pages />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

// Sidebar Pages Section
function Pages() {
  // selected Pid
  const [selectPid, setSelectPid] = useState<string>("");
  const [pagesDetails, setPagesDetails] = useState<PagesTypes[]>([]);
  const data = useAppSelector((state) => state.userData.pages);

  const setPagesData = useCallback(() => {
    setPagesDetails(data);
    console.log(data);
  }, [setPagesDetails, data]);

  useEffect(() => {
    setPagesData();
  }, [data, setPagesData]);

  console.log(selectPid);

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Pages</SidebarGroupLabel>

        <ContextMenu>
          {/* Favourite Pages */}

          <SidebarMenu>
            <Collapsible
              asChild
              defaultOpen={false}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={"Favourite Pages"}
                    className="flex justify-between"
                  >
                    <p className=" text-ellipsis overflow-hidden whitespace-nowrap">
                      Favourite Pages
                    </p>
                    <div>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ContextMenuTrigger>
                    <SidebarMenuSub>
                      {pagesDetails.length != 0 &&
                        pagesDetails.map(
                          (item) =>
                            !item.private && (
                              <SidebarMenuSubItem
                                key={item.pid}
                                onMouseDown={() => {
                                  setSelectPid(item.pid);
                                }}
                              >
                                <SidebarMenuSubButton asChild>
                                  <Link href={`/notion?pid=${item.pid}`}>
                                    <span className="overflow-hidden text-ellipsis">
                                      {item.title}
                                    </span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                        )}
                    </SidebarMenuSub>
                  </ContextMenuTrigger>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>

          <SidebarMenu>
            <Collapsible
              asChild
              defaultOpen={true}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={"Private Pages"}
                    className="flex justify-between"
                  >
                    <p>
                      {/* {items[0].title} */}
                      Private Pages
                    </p>
                    {/* create pages */}
                    <div className="flex items-center gap-3">
                      <AlertDialogDemo refreshFunction={setPagesData} />
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 " />
                    </div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ContextMenuTrigger>
                    <SidebarMenuSub>
                      {pagesDetails.length != 0 &&
                        pagesDetails.map(
                          (item) =>
                            item.private && (
                              <SidebarMenuSubItem
                                key={item.pid}
                                onMouseDown={() => {
                                  setSelectPid(item.pid);
                                }}
                              >
                                <SidebarMenuSubButton asChild>
                                  <Link href={`/notion?pid=${item.pid}`}>
                                    <span className="overflow-hidden text-ellipsis">
                                      {item.title}
                                    </span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                        )}
                    </SidebarMenuSub>
                  </ContextMenuTrigger>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>

          <ContextMenuContent>
            <ContextMenuItem
              className="display justify-between"
              onClick={async () => {
                // Submit the Delete Request
                const response = await axios.get("/api/delete-pages", {
                  params: {
                    pid: selectPid,
                    headers: {
                      "Content-Type": "application/json",
                    },
                  },
                });

                if (!response.status) {
                  throw new Error("Error in deleting the page");
                }

                toast(response.data.message);
                // after deleting the page we will remove from the page
              }}
            >
              <p>Delete</p>
              <FileX />
            </ContextMenuItem>
            <ContextMenuItem>Billing</ContextMenuItem>
            <ContextMenuItem>Team</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>

        {/* Settings */}
      </SidebarGroup>
    </>
  );
}

// Create New Page Alert Dialog
function AlertDialogDemo({ refreshFunction }: { refreshFunction: () => void }) {
  const [pageName, setPageName] = useState<string>("");
  const reduxUser = useAppSelector((state) => state.userData.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function handleSubmit() {
    if (pageName.length === 0) {
      console.error("Input field should not be empty");
      return;
    }

    dispatch(setNewPage({ title: pageName, private: true }));
    refreshFunction();

    try {
      const response = await axios.post("/api/create", {
        title: pageName,
        email: reduxUser.email,
        ppid: null, // for future reference
      });

      if (!response.status) {
        console.error("ERR");
        return;
      }

      toast(response.data.message);

      dispatch(
        setUpdatePage({
          title: pageName,
          pid: response.data.pid,
          ppid: "",
          private: true,
        })
      );
      refreshFunction();
      router.push(`/notion?pid=${response.data.pid}`);
    } catch (err) {
      // if (err instanceof AxiosError) {
      //   toast(err.response.data.message || "ERRROR");
      // }

      if (axios.isAxiosError(err)) {
        toast(err.response?.data.message || "Error");
      } else {
        toast("An Unexpected error occurred");
      }
    } finally {
      setPageName("");
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <BadgePlus size={20} className="ml-2" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Enter the name of the page</AlertDialogTitle>
          <AlertDialogDescription>
            <Input
              placeholder="Name..."
              value={pageName}
              onChange={(e) => {
                setPageName(e.target.value);
              }}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// User Profile on Footer
function NavUser() {
  const { isMobile } = useSidebar();
  const user = useAppSelector((state) => state.userData.user);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Sparkles />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}

// WorkSpace Switcher on Header
function NavWorkSpaceSwitcher({
  workspace,
}: {
  workspace: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = useState(workspace[0]);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <activeTeam.logo className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeTeam.name}
                  </span>
                  <span className="truncate text-xs">{activeTeam.plan}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Teams
              </DropdownMenuLabel>
              {workspace.map((team, index) => (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => setActiveTeam(team)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <team.logo className="size-4 shrink-0" />
                  </div>
                  {team.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Add team
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}

// Side Bar Skeleton on Loading
function MySideBarSkeleton() {
  return (
    <SidebarMenu className="w-[250px]">
      {Array.from({ length: 10 }).map((_, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuSkeleton />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
