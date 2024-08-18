import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { globalStore } from '@/lib/global.store';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'

const inactiveProfilesQuery = () => {
  return queryOptions({
    queryKey: ['profile'],
    queryFn: async () => {
      const { supabase } = globalStore.getState().auth
      if (!supabase) {
        throw new Error('No supabase')
      }
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('id, role, active, name, surname')
        .eq('active', false)
      if (error) {
        console.log(error)
      }
      return profileData
    }
  })
}

export const Route = createFileRoute('/_app/activate-profiles')({
  loader: async ({ context }) => {
    return context.queryClient.ensureQueryData(inactiveProfilesQuery())
  },
  component: ActivateProfiles
});

function ActivateProfiles() {
  const query = useSuspenseQuery(inactiveProfilesQuery())
  const data = query.data;

  return (
    <div className="max-md border rounded-md p-8">
      {data && data.map((profile) => (
        <div key={profile.id} className="flex justify-between border p-4">
          <p>{profile.id}</p>
          <div>
            <div className="flex items-center">
              <Label htmlFor="name">Imię</Label>
            </div>
            <Input type="text" id="name" placeholder={profile.name || undefined}/>
          </div>
          <div>
            <div className="flex items-center">
              <Label htmlFor="name">Nazwisko</Label>
            </div>
            <Input type="text" id="surname" placeholder={profile.surname || undefined}/>
          </div>
          <div>
            <Input readOnly type="checkbox" className='w-8' id="active" checked={profile.active} />
            <Label htmlFor="active" className='text-xl'>konto aktywne</Label>
          </div>
          <Button type="submit">Aktywuj</Button>
        </div>
      ))}
    </div>
  )
}
