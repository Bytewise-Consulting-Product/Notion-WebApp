"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { SignInButton, SignUpButton } from "@clerk/nextjs";

// Landing Page without signin
export default function LandingPageOnSignIn() {
  return (
    <>
      <div>
        {/* Upper Box */}
        <div className="flex  place-items-center h-[80px]">
          <p className="ml-[40px] text-[26px] font-bold  font-serif select-none">
            Notion
          </p>
          {/* Navigation Flow */}
          <div className="ml-[30px] ">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[300px] lg:grid-cols-[.75fr_1fr]"></ul>
                  </NavigationMenuContent>
                  <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[300px] lg:grid-cols-[.75fr_1fr]"></ul>
                  </NavigationMenuContent>
                  <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[300px] lg:grid-cols-[.75fr_1fr]"></ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          {/* SignUp Flow */}
          <div className="right-[100px] absolute gap-4 flex">
            <div className="p-3 rounded-2xl hover:bg-gray-300">
              <SignUpButton />
            </div>
            <div className="p-3 rounded-2xl hover:bg-gray-300">
              <SignInButton />
            </div>
          </div>
        </div>

        {/* Main Body Content */}
        <div className="select-none">
          <p className="text-[150px] font-black font-serif ml-[200px] mt-[50px] ">
            NOTION
          </p>
          <p className="text-[50px] font-serif ml-[200px] -mt-[50px] font-stretch-extra-expanded">
            Create, Collaborate, and Stay Productive
          </p>
        </div>
      </div>
    </>
  );
}
