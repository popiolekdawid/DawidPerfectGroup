import ChangeTitle from '@/components/ChangingTitle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { globalStore } from '@/lib/global.store'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useCallback } from 'react'

export const Route = createFileRoute('/_app/albums/')({
  loader: async ({ context }) => {
    const supabase = context.auth.supabase
    if (!supabase) { return { events: [], previewPhotos: [] } }
    const { data } = await supabase.from('events')
      .select('id, description, created_at, photos(path)')
      .order("created_at", { ascending: false })
    if (!data) {
      return { events: [], previewPhotos: [] }
    }
    const previews = data.map(event => {
      const preview = event.photos[0]
      return new Promise<{ photo: string, eventID: string }>((resolve, reject) => {
        supabase.storage.from("pieski_photos").createSignedUrl(preview.path, 20, {
          transform: {
            width: 600,
            height: 600,
            resize: "cover",
            quality: 80
          }
        }).then(response => {
          if (response.data) {
            resolve({
              photo: response.data.signedUrl,
              eventID: event.id
            })
          }
          reject('error')
        })
      })
    })
    const resolved = await Promise.all(previews)
    return { events: data ?? [], previewPhotos: resolved }
  },
  component: AlbumsIndex
})


function AlbumsIndex() {
  const { events, previewPhotos } = Route.useLoaderData()
  const router = useRouter()
  const supabase = globalStore(state => state.auth.supabase)
  const handleNameChange = useCallback(async (id: string, title: string) => {
    if (!supabase) return
    await supabase.from('events').update({ description: title }).eq('id', id)
    router.invalidate()
  }, [supabase, router])
  const role = globalStore(state => state.auth.role)
  return (
    <div>
      <div className='flex justify-between items-center'>
        <h2 className='text-3xl'> Nasze wydarzenia  </h2>
        {role === 'uploader' ? <Button ><Link to='/albums/upload'>Dodaj </Link></Button> : null}
      </div>
      <ul className='grid grid-cols-1 gap-4 m-8 md:grid-cols-2 lg:grid-cols-4'>
        {events.map((event) => (
          <li key={event.id}>
            <Card className='w-full'>
              <CardHeader>
                <CardTitle><ChangeTitle title={event.description ?? "Nowe wydarzenie"} onChange={(title) => {
                  handleNameChange(event.id, title)
                }} /></CardTitle>
                <CardDescription>{new Date(event.created_at).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                {previewPhotos.find(p => p.eventID === event.id) ?
                  <img className='aspect-square object-cover' src={previewPhotos.find(p => p.eventID === event.id)?.photo} /> : null}
              </CardContent>
              <CardFooter>
                <Link to={`/albums/$albumID`} params={{
                  albumID: event.id
                }}>Zobacz {event.photos.length} zdjęć</Link>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
