import { Badge } from "@/components/ui/badge";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";

export default function StatusBadge({ active }: { active: boolean }) {
  return(
    <Badge variant={active ? "default" : "destructive"}>
      {active ? (
        <CheckCircleIcon className="mr-1 h-4 w-4" />
      ) : (
        <XCircleIcon className="mr-1 h-4 w-4" />
      )}
      {active ? "Aktywny" : "Nieaktywny"}
    </Badge>
  );
}