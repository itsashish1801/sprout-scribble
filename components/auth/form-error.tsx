import { AlertCircle } from "lucide-react";

export default function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="bg-red-100 text-red-800 p-4 rounded-md flex items-center text-sm gap-2 my-4 font-medium">
      <AlertCircle size={16} />
      <p>{message}</p>
    </div>
  );
}
