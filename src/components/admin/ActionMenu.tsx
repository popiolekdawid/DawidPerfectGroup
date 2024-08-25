import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import { Profile } from "@/routes/_app.admin";
import StatusUpdateDialog from "@/components/admin/StatusUpdateDialog";

export default function ActionMenu({ profile, onUpdateStatus }: { profile: Profile, onUpdateStatus: (userId: string, currentStatus: boolean) => void }) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled>Edytuj</DropdownMenuItem>
            <StatusUpdateDialog profile={profile} onUpdateStatus={onUpdateStatus} />
          <DropdownMenuItem disabled>Usuń</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }