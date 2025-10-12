import { Outlet } from '@tanstack/react-router'
import Header from '@/components/Header'
import type { FC } from 'react'
type LayoutProps = object

const Layout: FC<LayoutProps> = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout