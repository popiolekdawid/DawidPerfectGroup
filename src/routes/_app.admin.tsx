import { useState } from 'react';
import { globalStore } from '@/lib/global.store';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import ProfilesTable from '@/components/admin/ProfilesTable';

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
  beforeLoad: async ({ context }) => {
    if (!context.auth.session) throw redirect({ to: '/login' })
    if (!context.auth.supabase) return

    const { data } = await context.auth.supabase.from("profiles")
      .select("role")
      .eq("user_id", context.auth.session.user.id)
      .single()
    
    if (data?.role !== "admin") throw redirect({ to: '/permissions' })
  },
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
      const { error } = await supabase
        .from('profiles')
        .update({ active: !currentStatus })
        .eq('id', userId);
      if (error) {
        console.error('Error updating user status:', error);
      } else {
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
