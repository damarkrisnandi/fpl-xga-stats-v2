"use client";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { SheetClose } from '../ui/sheet';
import { leaguesData } from '@/utils';



const AppSheetMenu = () => {
    return (
        <div>
            {/* <Accordion type="single" collapsible className="w-full"> */}
            {/*     {leaguesData.map((league: any) => ( */}
            {/*         <AccordionItem key={league.name} value={league.name}> */}
            {/*             <AccordionTrigger> */}
            {/*                 <div className="flex items-center justify-start w-full"> */}
            {/*                     {league.name} */}
            {/*                     {league.current && (<span className="w-2 h-2 bg-green-500 rounded-full m-2"></span>)} */}
            {/*                 </div> */}
            {/**/}
            {/*             </AccordionTrigger> */}
            {/*             <AccordionContent> */}
            {/*                 <Accordion type="single" collapsible className="w-full"> */}
            {/*                     { */}
            {/*                         league.children.map((league: any) => ( */}
            {/*                             <SheetClose asChild> */}
            {/*                                 <Button asChild variant={'ghost'} className="w-full"> */}
            {/*                                     <Link href={'/' + (league.league ? 'league/' : '')+ league.id} passHref={false}> */}
            {/*                                         {league.name} */}
            {/*                                     </Link> */}
            {/*                                 </Button> */}
            {/*                             </SheetClose> */}
            {/**/}
            {/*                         ) */}
            {/*                         )} */}
            {/**/}
            {/*                 </Accordion> */}
            {/*             </AccordionContent> */}
            {/*         </AccordionItem> */}
            {/*     ) */}
            {/*     )} */}
            {/**/}
            {/* </Accordion> */}
        </div>

    );
};

export default AppSheetMenu;
