import { Fragment, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { useAppStore } from '../../store/themeStore';

// Import icons from lucide-react
import {
    LayoutDashboard,
    Settings,
    PanelLeftClose,
    PanelRightClose,
    Building2,
    UserCircle, // A more specific icon for "Offices"
} from 'lucide-react';


const Sidebar = () => {
    const { isSidebarOpen, toggleSidebar, isSidebarCollapsed, toggleSidebarCollapse } = useAppStore();
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1200);

    // Effect to handle window resizing for the collapse button
    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1200);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Common NavLink styling
    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center rounded-md p-3 text-sm font-medium transition-colors ${isActive
            ? 'bg-orange-100 text-orange-600 dark:bg-gray-700 dark:text-orange-400'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        }`;

    const sidebarContent = (
        <>
            {/* Sidebar Header */}
            <div className="flex h-16 flex-shrink-0 items-center border-b border-gray-200 px-4 dark:border-gray-700">
                <span className={`text-xl font-semibold text-gray-800 dark:text-white ${isSidebarCollapsed && isDesktop ? 'hidden' : ''}`}>Agos Admin</span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-2 overflow-y-auto p-4">
                <NavLink to="/" className={navLinkClasses}>
                    <LayoutDashboard className="h-6 w-6 flex-shrink-0" />
                    <span className={`ml-3 ${isSidebarCollapsed && isDesktop ? 'hidden' : ''}`}>Dashboard</span>
                </NavLink>
                <NavLink to="/offices" className={navLinkClasses}>
                    <Building2 className="h-6 w-6 flex-shrink-0" />
                    <span className={`ml-3 ${isSidebarCollapsed && isDesktop ? 'hidden' : ''}`}>Offices</span>
                </NavLink>
                <NavLink to="/employees" className={navLinkClasses}>
                    <UserCircle className="h-6 w-6 flex-shrink-0" />
                    <span className={`ml-3 ${isSidebarCollapsed && isDesktop ? 'hidden' : ''}`}>Employees</span>
                </NavLink>
                <NavLink to="/settings" className={navLinkClasses}>
                    <Settings className="h-6 w-6 flex-shrink-0" />
                    <span className={`ml-3 ${isSidebarCollapsed && isDesktop ? 'hidden' : ''}`}>Settings</span>
                </NavLink>
            </nav>

            {/* Collapse Toggle Button (Desktop only) */}
            {isDesktop && (
                <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                    <button
                        onClick={toggleSidebarCollapse}
                        className="flex w-full items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                        {isSidebarCollapsed ? <PanelRightClose className="h-6 w-6" /> : <PanelLeftClose className="h-6 w-6" />}
                        <span className="sr-only">Toggle sidebar</span>
                    </button>
                </div>
            )}
        </>
    );

    return (
        <>
            {/* --- Mobile Sidebar (Off-canvas) --- */}
            <Transition.Root show={isSidebarOpen} as={Fragment}>
                <Dialog as="div" className="relative z-40 md:hidden" onClose={toggleSidebar}>
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
            <div className={`hidden md:flex md:flex-shrink-0 ${isSidebarCollapsed ? 'w-20' : 'w-64'} flex-col bg-white shadow-md transition-all duration-300 ease-in-out dark:bg-gray-800`}>
                {sidebarContent}
            </div>
        </>
    );
};

export default Sidebar;