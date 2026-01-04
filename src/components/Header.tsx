import { Menu as MenuIcon, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link as RouterLink, MenuItemLink } from '@/components/aria-router-links'
import {
    Menu,
    MenuPopover,
    MenuTrigger,
    MenuSubTrigger,
    MenuItem,
} from '@/components/ui/menu'
import { navigation } from '@/lib/navigation'
import Logo from '@/components/Logo'
import type {FC} from "react";
import { useThemeController } from '@/hooks/useThemeController'

 type HeaderProps = object


 const Header: FC<HeaderProps> = () => {
    const { isDark, setTheme } = useThemeController()

    const handleToggle = () => {
        setTheme(isDark ? 'light' : 'dark')
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="container flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <RouterLink
                    to="/"
                    aria-label="Home"
                    className="flex items-center gap-2 text-xl font-bold transition-colors hover:text-primary"
                >
                    <Logo />
                </RouterLink>

                {/* Desktop Navigation & Dark Mode Toggle */}
                <div className="flex items-center gap-2">
                    <div className="hidden md:flex md:items-center md:gap-6" aria-label="Desktop navigation">
                        {navigation.map((item) =>
                            item.children ? (
                                <MenuTrigger key={item.name}>
                                    <Button variant="ghost" className="text-sm font-medium">
                                        {item.name}
                                    </Button>
                                    <MenuPopover>
                                        <Menu aria-label={item.name}>
                                            {item.children.map((child) => (
                                                <MenuItemLink
                                                    key={child.name}
                                                    to={child.to}
                                                    className="w-full text-left"
                                                >
                                                    {child.name}
                                                </MenuItemLink>
                                            ))}
                                        </Menu>
                                    </MenuPopover>
                                </MenuTrigger>
                            ) : (
                                <RouterLink
                                    key={item.name}
                                    to={item.to}
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                    activeProps={{ className: "text-primary" }}
                                >
                                    {item.name}
                                </RouterLink>
                            )
                        )}
                    </div>

                    {/* Dark Mode Toggle */}
                    <Button
                        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        size="icon"
                        variant="ghost"
                        onPress={handleToggle}
                        className="transition-transform hover:scale-110"
                    >
                        {isDark ? (
                            <Sun className="h-5 w-5 transition-all" />
                        ) : (
                            <Moon className="h-5 w-5 transition-all" />
                        )}
                    </Button>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                    <MenuTrigger>
                        <Button aria-label="Menu" size="icon" variant="outline">
                            <MenuIcon className="h-5 w-5" />
                        </Button>
                        <MenuPopover>
                            <Menu aria-label="Mobile navigation">
                                {navigation.map((item) => (
                                    item.children ? (
                                        <MenuSubTrigger key={item.name}>
                                            <MenuItem>{item.name}</MenuItem>
                                            <Menu aria-label={item.name}>
                                                {item.children.map((child) => (
                                                    <MenuItemLink
                                                        key={child.name}
                                                        to={child.to}
                                                        className="w-full text-left"
                                                    >
                                                        {child.name}
                                                    </MenuItemLink>
                                                ))}
                                            </Menu>
                                        </MenuSubTrigger>
                                    ) : (
                                        <MenuItemLink
                                            key={item.name}
                                            to={item.to}
                                            className="w-full text-left"
                                        >
                                            {item.name}
                                        </MenuItemLink>
                                    )
                                ))}
                            </Menu>
                        </MenuPopover>
                    </MenuTrigger>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Header