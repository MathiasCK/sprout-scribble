import { AlertCircle } from "lucide-react";

const FormError = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <div className="bg-destructive/25 flex items-center gap-2 text-secondary-foreground p-3 rounded-md my-2 text-xs font-medium">
      <AlertCircle size={4} />
      <p>{message}</p>
    </div>
  );
};

export default FormError;
