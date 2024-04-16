import { bucket } from '@/lib/bucket';
import { globalStore } from '@/lib/global.store';
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { Gallery } from "react-grid-gallery";

export const Route = createFileRoute('/_app/albums/$albumID')({
  loader: async ({ context, params }) => {
    let data = globalStore.getState().albumPhotos[params.albumID]
    const supabase = context.auth.supabase
    if (!supabase) { return { photos: [] } }
    if (!data) {
      const { data: loadData } = await supabase.
        from('photos').
        select('path').
        eq('event_id', params.albumID)
      if (!loadData) {
        return { photos: [] }
      }
      globalStore.setState(state => ({
        ...state,
        albumPhotos: {
          ...state.albumPhotos,
          [params.albumID]: loadData
        }
      }))
      data = loadData
    }
    const urlsQueries = data.map(photo => new Promise<{ signedUrl: string, path: string }>((resolve, reject) => {
      supabase.storage.from(bucket).createSignedUrl(photo.path, 3600, {
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
    let urls = globalStore.getState().albumCache[params.albumID]
    if (!urls) {
      urls = await Promise.all(urlsQueries)
      globalStore.setState(state => ({
        ...state,
        albumCache: {
          ...state.albumCache,
          [params.albumID]: urls
        }
      }))
    }
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
