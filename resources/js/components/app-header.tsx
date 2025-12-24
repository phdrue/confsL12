import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Menu, Search, ChevronDown } from 'lucide-react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';

// Conferences Dropdown Component
function ConferencesDropdown() {
    const page = usePage();
    
    const conferenceStates = [
        { id: 3, name: 'Актуальные', url: route('conferences.index', { state: 3 }) },
        { id: 4, name: 'Архив', url: route('conferences.index', { state: 4 }) },
        { id: 2, name: 'В плане', url: route('conferences.table') },
    ];

    const isConferencesPage = page.url.startsWith('/conferences');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={cn(
                        navigationMenuTriggerStyle(),
                        isConferencesPage && activeItemStyles,
                        'h-9 cursor-pointer px-3 flex items-center gap-1'
                    )}
                >
                    Мероприятия
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                {conferenceStates.map((state) => (
                    <DropdownMenuItem key={state.id} asChild>
                        <Link href={state.url}>
                            {state.name}
                        </Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

const mainNavItems: NavItem[] = [
    {
        title: 'Рассылка',
        url: route('subscribe', [], false),
    },
    {
        title: 'Контакты',
        url: route('contacts', [], false),
    },
];

const rightNavItems: NavItem[] = [
    {
        title: 'Регистрация',
        url: route('register'),
    },
    {
        title: 'Войти',
        url: route('login'),
    },
];

const activeItemStyles = 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    return (
        <>
            <div className="sticky top-0 z-50 bg-white">
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-screen-xl">
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px]">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar">
                                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                <SheetHeader className="flex justify-start text-left">
                                    <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                    <VisuallyHidden>
                                        <SheetDescription>
                                            Description goes here
                                        </SheetDescription>
                                    </VisuallyHidden>
                                </SheetHeader>
                                <div className="mt-6 flex h-full flex-1 flex-col space-y-4">
                                    <div className="flex h-full flex-col justify-between text-sm">
                                        <div className="flex flex-col space-y-4">
                                            {/* Conferences Dropdown for Mobile */}
                                            <div className="flex flex-col space-y-2">
                                                <div className="font-medium text-gray-900 dark:text-gray-100">Мероприятия</div>
                                                <div className="ml-4 flex flex-col space-y-2">
                                                    <Link href={route('conferences.index', { state: 3 })} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                                                        Актуальные
                                                    </Link>
                                                    <Link href={route('conferences.index', { state: 4 })} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                                                        Архив
                                                    </Link>
                                                    <Link href={route('conferences.table')} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                                                        В плане
                                                    </Link>
                                                </div>
                                            </div>
                                            
                                            {/* Other Navigation Items */}
                                            {mainNavItems.map((item) => (
                                                <Link key={item.title} href={item.url} className="flex items-center space-x-2 font-medium">
                                                    {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                    <span>{item.title}</span>
                                                </Link>
                                            ))}
                                        </div>

                                        {!auth.user && (
                                            <div className="flex flex-col space-y-4">
                                                {rightNavItems.map((item) => (
                                                    <Link key={item.title} href={item.url} className="flex items-center space-x-2 font-medium">
                                                        {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                        <span>{item.title}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link href={route('home')} prefetch className="flex items-center space-x-2">
                        <AppLogo name={page.props.name} />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden h-full items-center space-x-6 lg:flex lg:grow">
                        <NavigationMenu className="flex h-full items-center justify-between max-w-full">
                            <NavigationMenuList className="flex h-full items-stretch grow space-x-2">
                                {/* Conferences Dropdown */}
                                <NavigationMenuItem className="relative flex h-full items-center">
                                    <ConferencesDropdown />
                                </NavigationMenuItem>
                                
                                {/* Other Navigation Items */}
                                {mainNavItems.map((item, index) => (
                                    <NavigationMenuItem key={index} className="relative flex h-full items-center">
                                        <Link
                                            prefetch
                                            href={item.url}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                page.url === item.url && activeItemStyles,
                                                'h-9 cursor-pointer px-3',
                                            )}
                                        >
                                            {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                            {item.title}
                                        </Link>
                                        {page.url === item.url && (
                                            <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                            {!auth.user &&
                                <NavigationMenuList>
                                    {rightNavItems.map((item, index) => (
                                        <NavigationMenuItem key={index} className="relative flex h-full items-center">
                                            <Link
                                                prefetch
                                                href={item.url}
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    page.url === item.url && activeItemStyles,
                                                    'h-9 cursor-pointer px-3',
                                                )}
                                            >
                                                {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                                {item.title}
                                            </Link>
                                            {page.url === item.url && (
                                                <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                            )}
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>}
                        </NavigationMenu>
                    </div>

                    <div className="ml-auto flex items-center space-x-2">
                        <div className="relative flex items-center space-x-1">
                        </div>
                        {auth.user && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="size-10 rounded-full p-1">
                                        <Avatar className="size-8 overflow-hidden rounded-full">
                                            <AvatarImage src={auth.user.avatar} alt="" />
                                            <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                {getInitials(auth.user.email ?? "")}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="border-sidebar-border/70 flex w-full border-b sticky top-[calc(4rem)] z-50 bg-white">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
