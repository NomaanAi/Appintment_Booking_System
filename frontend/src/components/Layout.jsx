import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto w-full py-6 px-4 sm:px-6 lg:px-8">
                <Outlet />
            </main>
            <footer className="bg-white dark:bg-gray-800 shadow mt-auto border-t border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-center">
                     <p className="text-sm text-gray-500 dark:text-gray-400">
                        &copy; {new Date().getFullYear()} Appointment System
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
