import { Loader2 } from "lucide-react";

const AppSpinner = () => {
  return (
    <div className="w-10 h-10 bg-green-200 flex justify-center items-center rounded-lg">
      <Loader2 className="h-4 w-4 animate-spin" />
    </div>
  );
};

export default AppSpinner;
