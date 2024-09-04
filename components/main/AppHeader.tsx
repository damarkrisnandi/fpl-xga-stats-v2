"use client";
import AppHamburgerMenu from "@/components/main/AppHamburgerMenu";
import { Button } from "../ui/button";
import { AlignJustify } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "../ui/sheet";
import AppSheetMenu from "./AppSheetMenu";
import Image from "next/image";

const AppHeader = () => {
  return (
    <nav className="bg-[#37003c] h-16 w-full p-5 flex space-x-6 items-center fixed top-0 shadow-md z-10">
      <Sheet>
        <SheetTrigger>
          <AlignJustify className="h-4 w-4 text-white" />
        </SheetTrigger>
        <SheetContent side={"left"} className="pt-12">
          <SheetHeader>
            <div className="bg-[#37003c] w-16 h-16 flex justify-center items-center rounded-lg shadow-md">
                <Image src="/pl-main-logo.png" alt="PL" width={32} height={32} /> 
            </div>
            <SheetTitle>Main Menu</SheetTitle>
          </SheetHeader>
          <AppSheetMenu />
        </SheetContent>
      </Sheet>
      <div className="flex justify-center items-center space-x-4">
 <Image src="/pl-main-logo.png" alt="PL" width={24} height={24} />
 <div className="flex items-center">
 <p className="text-sm font-bold text-white">Fantasy</p> 
 <p className="text-sm font-bold bg-white pt-1 pb-1 pr-2">XGA</p>
 </div>
      
       
      </div>
          </nav>
  );
};

export default AppHeader;
