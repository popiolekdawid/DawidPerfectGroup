import { useState } from 'react';
import { globalStore } from '@/lib/global.store';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import ProfilesTable from '@/components/ProfilesTable';

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
  const query = useSuspenseQuery(profileQuery());
  const profiles: Profile[] | null = query.data as Profile[] | null
  const [loading, setLoading] = useState(false);

  const updateUserStatus = async (userId: string, currentStatus: boolean) => {
    setLoading(true);
    const { supabase } = globalStore.getState().auth;
    if (!supabase) {
      throw new Error('No supabase');
    }
    try {
      console.log('Current status:', currentStatus);
      const { error } = await supabase
        .from('profiles')
        .update({ active: true })
        .eq('id', userId);
      if (error) {
        console.error('Error updating user status:', error);
      } else {
        console.log('User status updated successfully');
        query.refetch();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (profiles !== null) {
    return (
      <div className='max-md border rounded-md p-8'>
        {loading && <p>Updating user status...</p>}
        <ProfilesTable profiles={profiles} onUpdateStatus={updateUserStatus} />
      </div>
    )
  } else {
    return <p>Nie znaleziono użytkowników</p>
  }
}
