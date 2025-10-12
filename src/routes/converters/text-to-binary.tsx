import { createFileRoute } from '@tanstack/react-router'
import TextToBinary from "@/pages/TextToBinary";
import { iconvReadyQueryOptions } from '@/lib/queries/iconv'


export const Route = createFileRoute('/converters/text-to-binary')({
    loader: async ({ context }) => {
        // Preload the iconv-lite chunk before rendering the page
        await context.queryClient.ensureQueryData(iconvReadyQueryOptions)
        return null
    },
    component: TextToBinary,
})
