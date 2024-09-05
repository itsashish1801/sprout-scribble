import { AlertCircle, CheckCircle } from "lucide-react";

export default function FormSuccess({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="bg-green-100 text-green-800 p-4 rounded-md flex text-sm items-center gap-2 my-4 font-medium">
      <CheckCircle size={16} />
      <p>{message}</p>
    </div>
  );
}
