import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    // Note: The 'isSidebarOpen' state from Zustand will now likely be used
    // primarily within the Sidebar component itself to handle its mobile visibility.
    // The Layout component becomes simpler and more declarative.

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            {/* The Sidebar component will manage its own collapsed/expanded and mobile states */}
            <Sidebar />

            {/* Main content wrapper that takes up the remaining space */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />

                {/* Main content area with its own scrolling */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <Outlet /> {/* Child routes will render here */}
                </main>
            </div>
        </div>
    );
};

export default Layout;
