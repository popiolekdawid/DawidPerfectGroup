import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "@/components/ui/table";
import { Profile } from "@/routes/_app.admin";
import StatusBadge from "@/components/admin/StatusBadge";
import ActionMenu from "@/components/admin/ActionMenu";

interface ProfilesTableProps {
  profiles: Profile[];
  onUpdateStatus: (userId: string, currentStatus: boolean) => void;
}

export default function ProfilesTable({ profiles, onUpdateStatus }: ProfilesTableProps) {
  const activeProfilesCount = profiles.filter(profile => profile.active).length;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>Imię</TableHead>
          <TableHead>Nazwisko</TableHead>
          <TableHead>Rola</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[50px]">Akcje</TableHead>
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
          <TableCell className="text-center w-[50px]">{activeProfilesCount}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}