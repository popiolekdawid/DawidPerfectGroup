import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Badge } from "@/components/ui/badge";
  import {
    CheckCircleIcon,
    XCircleIcon,
    MoreHorizontalIcon,
  } from "lucide-react";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Button } from "@/components/ui/button";
  import { Profile } from "@/routes/_app.admin";
  
  export default function ProfilesTable({ profiles }: { profiles: Profile[] }) {
    const activeprofiles = profiles.filter((profile) => profile.active).length;
  
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
          <Badge variant={profile.active ? "default" : "destructive"}>
            {profile.active ? (
            <CheckCircleIcon className="mr-1 h-4 w-4" />
            ) : (
            <XCircleIcon className="mr-1 h-4 w-4" />
            )}
            {profile.active ? "Aktywny" : "Nieaktywny"}
          </Badge>
          </TableCell>
          <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuItem disabled>Edytuj</DropdownMenuItem>
            {!profile.active && (
              <DropdownMenuItem>Zmień status</DropdownMenuItem>
            )}
            <DropdownMenuItem disabled>Usuń</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </TableCell>
        </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
        <TableCell colSpan={5}>
          Łączna liczba aktywnych użytkowników
        </TableCell>
        <TableCell>{activeprofiles}</TableCell>
        </TableRow>
      </TableFooter>
      </Table>
    );
  }
  