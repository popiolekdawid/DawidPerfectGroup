import { globalStore } from '@/lib/global.store';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import ProfilesTable from '@/components/ProfilesTable'

export interface Profile {
  id: string
  user_id: string
  created_at: string
  active: boolean
  role: string
  name: string
  surname: string
}

const profileQuery = () => {
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
      if (error) {
        console.log(error)
      }
      return profileData
    }
  })
}

export const Route = createFileRoute('/_app/admin')({
  loader: async ({ context }) => {
    return context.queryClient.ensureQueryData(profileQuery())
  },
  component: Admin
});

function Admin() {
  const query = useSuspenseQuery(profileQuery())
  const profiles: Profile[] | null = query.data as Profile [] | null


  if (profiles !== null) {
    return (
      <div className='max-md border rounded-md p-8'>
        <ProfilesTable profiles={profiles} />
      </div>
    )
  } else {
    <p>Nie znaleziono uzytkownikow</p>
  }
}
