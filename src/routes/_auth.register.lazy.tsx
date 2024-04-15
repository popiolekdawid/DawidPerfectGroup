import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/useAuth'
import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

export const Route = createLazyFileRoute('/_auth/register')({
  component: RegisterPage
})

interface Inputs {
  email: string
  password: string
  firstName: string
  lastName: string
}

function RegisterPage() {
  const {
    register,
    handleSubmit,
    setError
  } = useForm<Inputs>()
  const auth = useAuth()
  const registerHandler = useCallback(async (input: Inputs) => {
    const { supabase } = auth
    const { error, data } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          firstName: input.firstName,
          lastName: input.lastName
        }
      }
    })
    if (error) {
      setError("root", { type: "manual", message: "Coś poszło nie tak" })
      console.error(error)
    }
    console.log(data)
  })

  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Witamy!</h1>
        <p className="text-balance text-muted-foreground">
          Proszę podaj swoje dane, postaramy się zweryfikować twoje zgłoszenie jak najszybciej
        </p>
      </div>
      <form onSubmit={handleSubmit(registerHandler)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="first-name">Twoje Imię</Label>
            <Input {...register("firstName")} id="first-name" placeholder="Jan" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="last-name">Nazwisko</Label>
            <Input {...register("lastName")} id="last-name" placeholder="Nowak" required />
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Bezpieczne hasło</Label>
            </div>
            <Input {...register("password")} id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Zarejestruj się
          </Button>
        </div>
      </form>
      <div className="mt-4 text-center text-sm">
        Masz już konto?{" "}
        <Link to="/login" className="underline">
          Zaloguj się
        </Link>
      </div>
    </div>
  )
}
