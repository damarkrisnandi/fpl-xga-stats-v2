import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CircleX,
} from "lucide-react";

const AppFailedToFetch = () => {
  return (
    <Card className="w-11/12 md:w-5/12 mb-2">
      <CardHeader></CardHeader>
      <CardContent>
        <div className="flex flex-col justify-center items-center space-y-5 w-full">
          <div className="w-10 h-10 bg-slate-200 flex justify-center items-center rounded-lg">
            <CircleX />
          </div>
          <p className="text-xs">Failed to fetch data, please try again later</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppFailedToFetch;