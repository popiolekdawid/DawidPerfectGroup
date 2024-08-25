import { Badge } from "@/components/ui/badge";
import { CheckCircleIcon, XCircleIcon, MoreHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "@/components/ui/table";
import { Profile } from "@/routes/_app.admin";

interface ProfilesTableProps {
  profiles: Profile[];
  onUpdateStatus: (userId: string, currentStatus: boolean) => void;
}

function StatusBadge({ active }: { active: boolean }) {
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

function ActionMenu({ profile, onUpdateStatus }: { profile: Profile, onUpdateStatus: (userId: string, currentStatus: boolean) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled>Edytuj</DropdownMenuItem>
        <Dialog>
          <DialogTrigger className="px-2 py-1.5 text-sm">
            {profile.active ? "Dezaktywuj profil" : "Aktywuj profil"}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Czy na pewno chcesz {profile.active ? "dezaktywować" : "aktywować"} profil użytkownika numer {profile.id}?
              </DialogTitle>
              <DialogDescription>
                {profile.active ? "Po dezaktywacji użytkownik nie będzie mógł się zalogować do swojego konta." : "Po aktywacji użytkownik będzie mógł się zalogować do swojego konta."}
              </DialogDescription>
              <DialogFooter>
                <Button
                  variant={profile.active ? "destructive" : "default"}
                  onClick={() => onUpdateStatus(profile.id, profile.active)}
                  className="mt-4"
                >
                  {profile.active ? 'Dezaktywuj konto' : 'Aktywuj konto'}
                </Button>
              </DialogFooter>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <DropdownMenuItem disabled>Usuń</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function ProfilesTable({ profiles, onUpdateStatus }: ProfilesTableProps) {
  const activeProfilesCount = profiles.filter(profile => profile.active).length;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID Użytkownika</TableHead>
          <TableHead>Imię</TableHead>
          <TableHead>Nazwisko</TableHead>
          <TableHead>Rola</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[100px]">Akcje</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {profiles.sort((a, b) => +a.id - +b.id).map((profile) => (
          <TableRow key={profile.id}>
            <TableCell className="font-medium">{profile.id}</TableCell>
            <TableCell>{profile.name || "-"}</TableCell>
            <TableCell>{profile.surname || "-"}</TableCell>
            <TableCell>{profile.role}</TableCell>
            <TableCell>
              <StatusBadge active={profile.active} />
            </TableCell>
            <TableCell>
              <ActionMenu profile={profile} onUpdateStatus={onUpdateStatus} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5}>Łączna liczba aktywnych użytkowników</TableCell>
          <TableCell>{activeProfilesCount}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}