import { createFileRoute } from '@tanstack/react-router'
import { iconvReadyQueryOptions } from '@/lib/queries/iconv'
import TextBase64 from '@/pages/TextBase64';
import {LoaderPending} from '@/components/Loader'


export const Route = createFileRoute('/converters/text-to-base64')({
    loader: async ({ context }) => {
        return await context.queryClient.ensureQueryData(iconvReadyQueryOptions)

    },
    component: TextBase64,
    pendingComponent: LoaderPending,

})
