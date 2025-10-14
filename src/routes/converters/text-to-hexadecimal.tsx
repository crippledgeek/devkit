import { createFileRoute } from '@tanstack/react-router'
import { iconvReadyQueryOptions } from '@/lib/queries/iconv'
import TextToHexadecimal from '@/pages/TextToHexadecimal';
import {LoaderPending} from '@/components/Loader'


export const Route = createFileRoute('/converters/text-to-hexadecimal')({
    loader: async ({ context }) => {
        return await context.queryClient.ensureQueryData(iconvReadyQueryOptions)

    },
    component: TextToHexadecimal,
    pendingComponent: LoaderPending,

})
