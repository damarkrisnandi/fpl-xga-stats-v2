"use client";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { SheetClose } from "../ui/sheet";
import { menuTree } from "@/utils";
import { usePathname } from "next/navigation";
import { Separator } from "@radix-ui/react-select";
import Image from "next/image";

const AppSideBar = () => {
  const pathname = usePathname();
  console.log("cek", pathname);
  return (
    <div className="pt-24 pl-10 w-2/12 bg-slate-200 hidden md:block fixed top-0 h-screen">
      <div className="bg-[#37003c] w-16 h-16 flex justify-center items-center rounded-lg shadow-md mb-10">
        <Image src="/pl-main-logo.png" alt="PL" width={32} height={32} />
      </div>
      {menuTree.map((menu: any) => (
        <div className="" key={menu.id}>
          <div className="flex items-center justify-start w-full font-semibold">
            {menu.name}
            {menu.current && (
              <span className="w-2 h-2 bg-green-500 rounded-full m-2"></span>
            )}
          </div>
          <Separator className="w-full" />
          <div className="ml-3 flex flex-col">
            {menu.children.map((submenu: any) => (
              <Button
                asChild
                variant={"ghost"}
                className="flex justify-start rounded-none"
                key={submenu.id}
                disabled={true}
              >
                <Link
                  href={"/" + submenu.id}
                  passHref={false}
                  className="justify-start"
                >
                  {submenu.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppSideBar;
