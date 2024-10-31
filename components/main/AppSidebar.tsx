"use client";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { menuTree } from "@/utils";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ChevronRightCircle } from "lucide-react";

const AppSideBar = () => {
  const pathname = usePathname();
  return (
    <div className="pt-24 pl-10">
      {menuTree.map((menu: any, index: number) => (
        <div className="" key={index}>
          <div className="flex items-center justify-start w-full font-semibold text-lg">
            {menu.name}
            {menu.current && (
              <span className="w-2 h-2 bg-green-500 rounded-full m-2"></span>
            )}
          </div>
          <div className=" flex flex-col">
            {menu.children.map((submenu: any, index: number) => (
              <Button
                asChild
                variant={"ghost"}
                className={`flex justify-start rounded-none ${
                  pathname == "/" + submenu.id ? "font-semibold text-md" : ""
                }`}
                key={index}
              >
                <Link
                  href={"/" + submenu.id}
                  passHref={false}
                  className="justify-start"
                >
                  <ChevronRightCircle className="w-4 h-4 mr-1" />
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
