import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Profile } from "@/routes/_app.admin";

export default function StatusUpdateDialog({ profile, onUpdateStatus }: { profile: Profile, onUpdateStatus: (userId: string, currentStatus: boolean) => void }) {
  return (
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
  );
}