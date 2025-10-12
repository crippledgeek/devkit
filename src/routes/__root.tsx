import { createRootRouteWithContext } from '@tanstack/react-router'
import Layout from '@/components/Layout'
import { Providers } from '@/components/Providers'
import type { QueryClient } from '@tanstack/react-query'

export interface RouterContext {
    queryClient: QueryClient
}

const RootLayout = () => (
    <Providers>
        <Layout />
    </Providers>
)

export const Route = createRootRouteWithContext<RouterContext>()({
    component: RootLayout,
})