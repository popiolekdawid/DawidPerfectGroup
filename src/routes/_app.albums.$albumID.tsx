import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { Gallery } from "react-grid-gallery";


export const Route = createFileRoute('/_app/albums/$albumID')({
  loader: async ({ context, params }) => {
    const { data } = await context.auth.supabase.
      from('photos').
      select('path').
      eq('event_id', params.albumID)
    if (!data) {
      return { photos: [] }
    }
    const { data: urls } = await context.auth.supabase.storage.from("pieski_photos")
      .createSignedUrls(data.map(photo => photo.path), 20)
    return { photos: urls?.map(u => ({ src: u.signedUrl, path: u.path })) ?? [] }
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
            // @ts-expect-error missing types
            photoID: photos[ev].path?.split("/")[1]
          }
        })
      }} />
      <Outlet />
    </>
  )
}
