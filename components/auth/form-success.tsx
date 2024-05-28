import { CheckCircle } from "lucide-react";

const FormSuccess = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <div className="bg-teal-400/25 flex items-center gap-2 text-secondary-foreground p-3 rounded-md my-2 text-xs font-medium">
      <CheckCircle className="h-4 -4" />
      <p>{message}</p>
    </div>
  );
};

export default FormSuccess;
