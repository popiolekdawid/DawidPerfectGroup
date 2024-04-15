import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/albums/')({
  loader: async ({ context }) => {
    const supabase = context.auth.supabase
    if (!supabase) { return { events: [], previewPhotos: [] } }
    const { data } = await supabase.from('events').select('id, description, created_at, photos(path)')
    if (!data) {
      return { events: [], previewPhotos: [] }
    }
    const previews = data.map(event => {
      const preview = event.photos[0]
      return new Promise<{ photo: string, eventID: string }>((resolve, reject) => {
        supabase.storage.from("pieski_photos").createSignedUrl(preview.path, 20).then(response => {
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
  return (
    <div>
      <h2 className='text-3xl'> Nasze wydarzenia  </h2>
      <ul className='grid grid-cols-4 gap-4 m-8'>
        {events.map((event) => (
          <li key={event.id}>
            <Card className='w-full'>
              <CardHeader>
                <CardTitle>{event.description ? event.description : "Nowe zdjęcia"}</CardTitle>
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
