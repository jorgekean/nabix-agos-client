import { Fragment, useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { useAppStore } from '../../store/themeStore';

import logoSrc from '../../assets/1-agos-logo-horizontal.png'

// Import icons from lucide-react
import {
    LayoutDashboard,
    Settings,
    PanelLeftClose,
    PanelRightClose,
    Building2,
    Laptop,
    Box,
    Users,
    FileText,
    ClipboardList,
    ChevronDown, // For the dropdown indicator
} from 'lucide-react';

const Sidebar = () => {
    const { isSidebarOpen, toggleSidebar, isSidebarCollapsed, toggleSidebarCollapse } = useAppStore();
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1200);

    // State for collapsible menus
    const [isAssetsOpen, setIsAssetsOpen] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);

    const location = useLocation();

    // Effect to auto-open the correct group based on the current URL
    useEffect(() => {
        const path = location.pathname;
        if (path.startsWith('/equipment') || path.startsWith('/supplies') || path.startsWith('/vouchers')) {
            setIsAssetsOpen(true);
        }
        if (path.startsWith('/offices') || path.startsWith('/employees') || path.startsWith('/catalog')) {
            setIsAdminOpen(true);
        }
    }, [location.pathname]);

    // Effect to handle window resizing
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1200);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex w-full items-center rounded-md p-3 text-sm font-medium transition-colors ${isActive
            ? 'bg-primary-100 text-primary-600 dark:bg-gray-700 dark:text-primary-400'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        }`;

    // The shared content for both mobile and desktop sidebars
    const sidebarContent = (
        <>
            <div className="flex h-16 flex-shrink-0 items-center justify-center border-b border-gray-200 px-4 dark:border-gray-700">
                <span className={`text-xl font-semibold text-gray-800 dark:text-white ${isSidebarCollapsed && isDesktop ? 'hidden' : ''}`}><img src={logoSrc} alt="Logo" className="h-16" /></span>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                <NavLink to="/" className={navLinkClasses}>
                    <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
                    <span className={`ml-3 ${isSidebarCollapsed && isDesktop ? 'hidden' : ''}`}>Dashboard</span>
                </NavLink>

                {/* --- Assets Group --- */}
                <div className={`pt-4 ${isSidebarCollapsed && isDesktop ? 'hidden' : ''}`}>
                    <button onClick={() => setIsAssetsOpen(!isAssetsOpen)} className="flex w-full items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                        <span>Assets</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isAssetsOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isAssetsOpen && (
                        <div className="mt-2 space-y-1">
                            <NavLink to="/equipment" className={navLinkClasses}>
                                <Laptop className="h-5 w-5 flex-shrink-0" />
                                <span className={`ml-3 ${isSidebarCollapsed && isDesktop ? 'hidden' : ''}`}>Equipment</span>
                            </NavLink>
                            <NavLink to="/supplies" className={navLinkClasses}>
                                <Box className="h-5 w-5 flex-shrink-0" />
                                <span className={`ml-3 ${isSidebarCollapsed && isDesktop ? 'hidden' : ''}`}>Supplies</span>
                            </NavLink>
                            <NavLink to="/vouchers" className={navLinkClasses}>
                                <FileText className="h-5 w-5 flex-shrink-0" />
                                <span className={`ml-3 ${isSidebarCollapsed && isDesktop ? 'hidden' : ''}`}>Receiving Vouchers</span>
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* --- Admin Group --- */}
                <div className={`pt-4 ${isSidebarCollapsed && isDesktop ? 'hidden' : ''}`}>
                    <button onClick={() => setIsAdminOpen(!isAdminOpen)} className="flex w-full items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                        <span>Admin</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isAdminOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isAdminOpen && (
                        <div className="mt-2 space-y-1">
                            <NavLink to="/offices" className={navLinkClasses}>
                                <Building2 className="h-5 w-5 flex-shrink-0" />
                                <span className={`ml-3 ${isSidebarCollapsed && isDesktop ? 'hidden' : ''}`}>Offices</span>
                            </NavLink>
                            <NavLink to="/employees" className={navLinkClasses}>
                                <Users className="h-5 w-5 flex-shrink-0" />
                                <span className={`ml-3 ${isSidebarCollapsed && isDesktop ? 'hidden' : ''}`}>Employees</span>
                            </NavLink>
                            <NavLink to="/catalog" className={navLinkClasses}>
                                <ClipboardList className="h-5 w-5 flex-shrink-0" />
                                <span className={`ml-3 ${isSidebarCollapsed && isDesktop ? 'hidden' : ''}`}>Asset Catalog</span>
                            </NavLink>

                        </div>
                    )}
                </div>

                {/* --- Settings --- */}
                <div className={`pt-4 ${isSidebarCollapsed && isDesktop ? 'hidden' : ''}`}>
                    <NavLink to="/settings" className={navLinkClasses}>
                        <Settings className="h-5 w-5 flex-shrink-0" />
                        <span className={`ml-3 ${isSidebarCollapsed && isDesktop ? 'hidden' : ''}`}>Settings</span>
                    </NavLink>
                </div>
            </nav>

            {/* Collapse/Expand Toggle Button (Desktop only) */}
            {isDesktop && (
                <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                    <button onClick={toggleSidebarCollapse} className="flex w-full items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                        {isSidebarCollapsed ? <PanelRightClose className="h-6 w-6" /> : <PanelLeftClose className="h-6 w-6" />}
                        <span className="sr-only">{isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}</span>
                    </button>
                </div>
            )}
        </>
    );

    return (
        <>
            {/* --- Mobile Sidebar (Off-canvas) --- */}
            <Transition.Root show={isSidebarOpen} as={Fragment}>
                <Dialog as="div" className="relative z-40 lg:hidden" onClose={toggleSidebar}>
                    <Transition.Child as={Fragment} enter="transition-opacity ease-linear duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-40 flex">
                        <Transition.Child as={Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
                            <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white dark:bg-gray-800">
                                {sidebarContent}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* --- Desktop Sidebar --- */}
            <div className={`hidden lg:flex lg:flex-shrink-0 ${isSidebarCollapsed ? 'w-20' : 'w-64'} flex-col bg-white shadow-md transition-all duration-300 ease-in-out dark:bg-gray-800`}>
                {sidebarContent}
            </div>
        </>
    );
};

export default Sidebar;