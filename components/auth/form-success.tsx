import { AlertCircle, CheckCircle } from "lucide-react";

export default function FormSuccess({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="bg-green-400 text-secondary-foreground p-3 rounded-md">
      <CheckCircle size={16} />
      <p>{message}</p>
    </div>
  );
}
