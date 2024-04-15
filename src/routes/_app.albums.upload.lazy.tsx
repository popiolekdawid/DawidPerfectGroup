import { createLazyFileRoute } from '@tanstack/react-router'
import Uppy from '@uppy/core'
import { Dashboard } from '@uppy/react'
import { useEffect, useState } from 'react'
//@ts-expect-error missing types
import Polish from '@uppy/locales/lib/pl_PL'
import Tus from '@uppy/tus';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import { nanoid } from 'nanoid'
import { useToast } from '@/components/ui/use-toast'
import Compressor from '@uppy/compressor';

export const Route = createLazyFileRoute('/_app/albums/upload')({
  component: UploadPage
})

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function UploadPage() {
  const [uploadID] = useState(() => nanoid(10))
  const { toast } = useToast()
  const context = Route.useRouteContext()
  const [uppy] = useState(() => new Uppy({
    locale: Polish,
    restrictions: {
      allowedFileTypes: ['image/*', 'video/*']
    }
  }).use(Tus, {
    endpoint: `${url}/storage/v1/upload/resumable`,
    headers: {
      authorization: `Bearer ${context.auth.session?.access_token}`,
      apikey: anonKey
    },
    uploadDataDuringCreation: true,
    chunkSize: 6 * 1024 * 1024,
    allowedMetaFields: ['bucketName', 'objectName', 'contentType', 'cacheControl']

  }).use(Compressor))
  useEffect(() => {
    uppy.on('file-added', (file) => {
      file.meta = {
        bucketName: 'pieski_photos',
        objectName: `${uploadID}/${file.name}`,
        contentType: file.type,
        cacheControl: 'public, max-age=31536000',
        name: file.name,
        type: file.type
      };
    });
    uppy.on("upload", async (data) => {
      await context.auth.supabase.from("events").upsert({
        id: uploadID,
      })
    })
    uppy.on('upload-success', async (file) => {
      await context.auth.supabase.from("photos").upsert({
        path: file?.meta.objectName as string,
        event_id: uploadID
      })

    })
    uppy.on("complete", (result) => {
      // uploaded files , save new album with files and reset uppy state 
      // should  also send some notifivation
      toast({
        title: "Pełen sukces",
        description: "Pliki zostały przesłane",
      })

    })
  }, [uppy])
  return <Dashboard width={"100%"} uppy={uppy} />
}
