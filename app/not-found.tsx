import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";
import Link from "next/link";

const NotFoundPage = () => {
    return (
        <main className="flex justify-center items-center pt-24 h-screen">
            <div className="flex h-full flex-col justify-center items-center space-y-5 w-11/12 md:w-5/12">
                <div className="w-10 h-10 bg-slate-200 flex justify-center items-center rounded-lg">
                <Construction />
                </div>
                <p className="text-xs">Oops..</p>
                <Button asChild variant={'outline'} className="w-full">
                    <Link href={`/`}>
                        Back to Home
                    </Link>
                </Button>

            </div>
        </main>
    )
}

export default NotFoundPage;