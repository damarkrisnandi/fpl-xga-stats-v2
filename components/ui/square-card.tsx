import * as React from "react";

import { cn } from "@/lib/utils";


const _StatItem = (props: any) => {
    const { className, label, value } = props;
    return (
        <div
            className={`w-14 h-14 md:w-24 md:h-24 p-1 md:p-3 flex flex-col justify-center items-center ${className || ""
                } bg-slate-200`}
        >
            <p className="text-[0.6em] md:text-sm">{label}</p>
            <p className="text-sm md:text-xl font-semibold">{value}</p>
        </div>
    );
};

const SquareCard = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "bg-card text-card-foreground",
            "w-14 h-14 md:w-24 md:h-24 p-1 md:p-3 flex flex-col justify-center items-center",
            className,
        )}
        {...props}
    />
));
SquareCard.displayName = "SquareCard";

const SquareCardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col justify-center items-center", className)}
        {...props}
    />
));
SquareCardHeader.displayName = "SquareCardHeader";

const SquareCardLabel = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn(
            "text-[0.6em] md:text-sm",
            className
        )}
        {...props}
    />
));
SquareCardLabel.displayName = "SquareCardLabel";

const SquareCardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
));
SquareCardContent.displayName = "SquareCardContent";

const SquareCardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center justify-center", className)}
        {...props}
    />
));
SquareCardFooter.displayName = "SquareCardFooter";

export {
    SquareCard,
    SquareCardContent, SquareCardFooter,
    SquareCardHeader, SquareCardLabel
};
