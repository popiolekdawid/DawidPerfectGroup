import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { Gallery } from "react-grid-gallery";


export const Route = createFileRoute('/_app/albums/$albumID')({
  loader: async ({ context, params }) => {
    const supabase = context.auth.supabase
    if (!supabase) { return { photos: [] } }
    const { data } = await supabase.
      from('photos').
      select('path').
      eq('event_id', params.albumID)
    if (!data) {
      return { photos: [] }
    }
    const urlsQueries = data.map(photo => new Promise<{ signedUrl: string, path: string }>((resolve, reject) => {
      supabase.storage.from("pieski_photos").createSignedUrl(photo.path, 3600, {
        transform: {
          width: 500,
          height: 350,
          resize: "cover",
          quality: 80
        }
      }).then(response => {
        if (response.data) {
          resolve({
            signedUrl: response.data.signedUrl,
            path: photo.path
          })
        }
        reject('error')
      })
    }))
    const urls = await Promise.all(urlsQueries)
    return { photos: urls?.map(u => ({ src: u.signedUrl, path: u.path, width: 450, height: 350 })) ?? [] }
  },
  component: AlbumsAlbumID
})

function AlbumsAlbumID() {
  const navigate = useNavigate()
  const { photos } = Route.useLoaderData()
  const params = Route.useParams()
  return (
    <>
      <Gallery images={photos} onClick={(ev) => {
        navigate({
          to: "/albums/$albumID/$photoID",
          params: {
            albumID: params.albumID,
            photoID: photos[ev].path?.split("/")[1]
          }
        })
      }} />
      <Outlet />
    </>
  )
}
