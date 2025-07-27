import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin" />
    </div>
  );
}
