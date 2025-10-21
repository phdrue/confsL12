import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, Auth } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, CloudCog, Folder, ImageIcon, LayoutGrid, UsersIcon } from 'lucide-react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';


const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     url: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     url: 'https://laravel.com/docs/starter-kits',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    const { auth } = usePage().props as { auth: Auth };
    const isAdmin = auth?.roles?.includes('Администратор') || false;

    const mainNavItems: NavItem[] = [
        {
            title: 'Конференции',
            url: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Предложения',
            url: route('adm.proposals.index'),
            icon: CloudCog,
        },
        {
            title: 'Банк изображений',
            url: route('adm.images.index'),
            icon: ImageIcon,
        },
        ...(isAdmin ? [{
            title: 'Пользователи',
            url: route('adm.users.index'),
            icon: UsersIcon,
        }] : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogoIcon className='size-4 aspect-square mr-0' />
                                Администрирование
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
