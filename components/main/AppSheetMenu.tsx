"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { SheetClose } from "../ui/sheet";
import { menuTree } from "@/utils";
import { usePathname } from "next/navigation";

const AppSheetMenu = () => {
  const pathname = usePathname();
  console.log("cek", pathname);
  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        {menuTree.map((menu: any) => (
          <AccordionItem key={menu.name} value={menu.name}>
            <AccordionTrigger>
              <div className="flex items-center justify-start w-full">
                {menu.name}
                {menu.current && (
                  <span className="w-2 h-2 bg-green-500 rounded-full m-2">
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Accordion type="single" collapsible className="w-full">
                {menu.children
                  .map((submenu: any) => (
                    <SheetClose
                      asChild
                      key={submenu.id}
                      disabled={pathname == `/${submenu.id}`}
                    >
                      <Button asChild variant={"ghost"} className="w-full">
                        <Link href={"/" + submenu.id} passHref={false}>
                          {submenu.name}
                        </Link>
                      </Button>
                    </SheetClose>
                  ))}
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default AppSheetMenu;
