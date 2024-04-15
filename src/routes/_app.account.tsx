import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/useAuth';
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

export const Route = createFileRoute('/_app/account')({
  loader: async ({ context: { auth } }) => {
    const { supabase } = auth
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('id, role, active,name,surname')
      .single();
    if (error) {
      console.log(error)
    }
    return profileData
  },
  component: AccountPage
})

interface FormInputsAccount {
  name: string,
  surname: string,
}

function AccountPage() {
  const data = Route.useLoaderData()
  const auth = useAuth()
  const router = useRouter()
  const updateProfile = useCallback(async (data: FormInputsAccount) => {
    const userId = auth.session?.user.id
    if (!userId) {
      throw new Error('No user id')
    }
    const { error } = await auth.supabase
      .from('profiles')
      .update({
        name: data.name,
        surname: data.surname,
      })
      .eq('user_id', userId)
    if (error) {
      console.error(error)
    }
    router.invalidate()
  }, [auth, router])
  const { register, handleSubmit } = useForm<FormInputsAccount>({
    values: {
      name: data?.name ?? "",
      surname: data?.surname ?? "",
    }
  })
  return (
    <div className="max-md border rounded-md p-4">
      <form onSubmit={handleSubmit(updateProfile)} className='flex flex-col gap-4 max-w-sm '>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="name">Imię</Label>
          </div>
          <Input type="text" id="name" {...register("name")} />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="name">Nazwisko</Label>
          </div>
          <Input type="text" id="surname" {...register("surname")} />
        </div>
        <div className='flex flex-row gap-2 items-center'>
          <Input readOnly type="checkbox" className='w-8' id="active" checked={data?.active} />
          <Label htmlFor="active" className='text-xl'>konto aktywne</Label>
        </div>
        <Button type="submit">Zapisz</Button>
      </form>
    </div>
  )
}

