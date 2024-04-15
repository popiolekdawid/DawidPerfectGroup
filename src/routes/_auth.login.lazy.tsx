import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Globe } from 'lucide-react'
import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/lib/useAuth'

interface Inputs {
  email: string
  password: string
}

export const Route = createLazyFileRoute('/_auth/login')({
  component: LoginPage
})

function LoginPage() {
  const { register, handleSubmit } = useForm<Inputs>()
  const { supabase } = useAuth()
  const handleLogin = async (data: Inputs) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      console.error(error)
    }
  }
  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Witamy!</h1>
        <p className="text-balance text-muted-foreground">
          Podaj swoje dane logowania do naszej grupy
        </p>
      </div>
      <form onSubmit={handleSubmit(async (data) => {
        handleLogin(data)
      })}>
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
            Login
          </Button>
          <Button disabled variant="outline" className="w-full">
            <Globe className="h-5 w-5 mr-2" />
            Użyj konta Google
          </Button>
        </div>
      </form>
      <div className="mt-4 text-center text-sm">
        Nie masz jeszcze konta?{" "}
        <Link to="/register" className="underline">
          Zapisz się
        </Link>
      </div>
    </div>
  )
}
