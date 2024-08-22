import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UserTable from '@/components/UserTable';
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

export const Route = createFileRoute('/_app/admin')({
  loader: async ({ context }) => {
    return context.queryClient.ensureQueryData(inactiveProfilesQuery())
  },
  component: Admin
});

function Admin() {
  const query = useSuspenseQuery(inactiveProfilesQuery())
  const data = query.data;

  return (
      <div className="max-md border rounded-md p-8">
        <UserTable />
      </div>
  )
}
