import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { RiMenuLine, RiSunLine, RiMoonLine } from 'react-icons/ri';

import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/themeStore';

const Header = () => {
    const { theme, toggleTheme, toggleSidebar } = useAppStore();
    const navigate = useNavigate();

    return (
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-800">
            {/* Mobile Sidebar Toggle */}
            <button
                onClick={toggleSidebar}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 md:hidden"
            >
                <RiMenuLine className="h-6 w-6" />
            </button>

            {/* Spacer */}
            <div className="flex-grow"></div>

            {/* Right-side Icons and User Menu */}
            <div className="flex items-center space-x-4">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:ring-offset-gray-800"
                >
                    {theme === 'light' ? <RiMoonLine className="h-6 w-6" /> : <RiSunLine className="h-6 w-6" />}
                </button>

                {/* Profile Dropdown */}
                <Menu as="div" className="relative">
                    <div>
                        <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                            <span className="sr-only">Open user menu</span>
                            <img
                                className="h-10 w-10 rounded-full"
                                src="https://i.pravatar.cc/40"
                                alt="User avatar"
                            />
                        </Menu.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700 dark:ring-gray-600">
                            <Menu.Item>
                                {({ active }) => (
                                    <a href="#" className={`${active ? 'bg-gray-100 dark:bg-gray-600' : ''} block px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}>
                                        Profile
                                    </a>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <a href="#" className={`${active ? 'bg-gray-100 dark:bg-gray-600' : ''} block px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}>
                                        Billing
                                    </a>
                                )}
                            </Menu.Item>
                            <div className="my-1 border-t border-gray-200 dark:border-gray-600" />
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => navigate('/login')}
                                        className={`${active ? 'bg-gray-100 dark:bg-gray-600' : ''} block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200`}
                                    >
                                        Logout
                                    </button>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </header>
    );
};

export default Header;
