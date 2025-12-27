import { createFileRoute } from '@tanstack/react-router'
import URLEncoder from '@/pages/URLEncoder'
import { iconvReadyQueryOptions } from '@/lib/queries/iconv'
import { LoaderPending } from '@/components/Loader'

export const Route = createFileRoute('/converters/url-encoder')({
    loader: async ({ context }) => {
        return await context.queryClient.ensureQueryData(iconvReadyQueryOptions)
    },
    component: URLEncoder,
    pendingComponent: LoaderPending,
})

