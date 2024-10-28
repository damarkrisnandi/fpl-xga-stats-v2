import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Armchair, RefreshCcw, Sparkle, Sparkles, ArrowDownUp } from "lucide-react";

export default function AppTransferDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-black text-white text-xs w-6 h-6 p-0">
            <ArrowDownUp className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] h-[60vh]">
        <DialogHeader>
          <DialogTitle>Make Transfer Hit</DialogTitle>
          <DialogDescription>
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full text-center">
            <p>Work In Progress</p>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
