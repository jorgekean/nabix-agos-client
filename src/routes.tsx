import type { RouteObject } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import LoginPage from "./pages/LoginPage";

// Import the new, separate pages for Office Management
import { OfficeIndexPage } from "./pages/office/OfficeIndexPage";
import { OfficeCreatePage } from "./pages/office/OfficeCreatePage";
import { OfficeEditPage } from "./pages/office/OfficeEditPage";
import { EmployeeIndexPage } from "./pages/employee/EmployeeIndexPage";
import { EmployeeCreatePage } from "./pages/employee/EmployeeCreatePage";
import { EmployeeEditPage } from "./pages/employee/EmployeeEditPage";

// Define your app's routes
const routes: RouteObject[] = [
    {
        // This is a top-level route for the login page
        // It does NOT use the main Layout component
        path: '/login',
        element: <LoginPage />,
    },
    {
        // The Layout component will wrap all dashboard-related routes
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Dashboard />,
            },

            // --- Office Management Routes ---
            {
                // The main list/table of offices
                path: '/offices',
                element: <OfficeIndexPage />,
            },
            {
                // The form for creating a new office
                path: '/offices/new',
                element: <OfficeCreatePage />,
            },
            {
                // The form for editing an existing office
                // ':id' is a URL parameter that we'll use to fetch the correct office
                path: '/offices/edit/:id',
                element: <OfficeEditPage />,
            },
            // --------------------------------

            // --- Employee Management Routes ---
            { path: '/employees', element: <EmployeeIndexPage /> },
            { path: '/employees/new', element: <EmployeeCreatePage /> },
            { path: '/employees/edit/:id', element: <EmployeeEditPage /> },
            {
                path: '/settings',
                element: <Settings />,
            },
        ],
    },
];

export default routes;