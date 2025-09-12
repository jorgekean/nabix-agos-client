import type { RouteObject } from "react-router-dom";
import React from "react";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import LoginPage from "./pages/LoginPage";

// Office Management
import { OfficeIndexPage } from "./pages/office/OfficeIndexPage";
import { OfficeCreatePage } from "./pages/office/OfficeCreatePage";
import { OfficeEditPage } from "./pages/office/OfficeEditPage";

// Employee Management
import { EmployeeIndexPage } from "./pages/employee/EmployeeIndexPage";
import { EmployeeCreatePage } from "./pages/employee/EmployeeCreatePage";
import { EmployeeEditPage } from "./pages/employee/EmployeeEditPage";

// Asset Catalog
import { AssetCatalogIndexPage } from "./pages/catalog/AssetCatalogIndexPage";
import { AssetCatalogCreatePage } from "./pages/catalog/AssetCatalogCreatePage";
import { AssetCatalogEditPage } from "./pages/catalog/AssetCatalogEditPage";

// Receiving Vouchers
import { ReceivingVoucherIndexPage } from "./pages/vouchers/ReceivingVoucherIndexPage";

// Equipment (Formerly Asset Instances)
import { EquipmentIndexPage } from "./pages/equipment/EquipmentIndexPage";
import { EquipmentReceivePage } from "./pages/equipment/EquipmentReceivePage"; // You will create this
// import { EquipmentEditPage } from "./pages/equipment/EquipmentEditPage";     // You will create this
import { EquipmentHistoryPage } from "./pages/equipment/EquipmentHistoryPage"; // You will create this

// Stock (Supplies)
import { StockIndexPage } from "./pages/stock/StockIndexPage";
import { ReceivingVoucherEditPage } from "./pages/vouchers/receivingVoucherEditPage";
import { EquipmentEditPage } from "./pages/equipment/EquipmentEditPage";
import { StockAddPage } from "./pages/stock/StockAddPage";
// import { StockAddPage } from "./pages/stock/StockAddPage";                 // You will create this

// Define your app's routes
const routes: RouteObject[] = [
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        element: <Layout />,
        children: [
            { path: '/', element: <Dashboard /> },

            // --- Office Routes ---
            { path: '/offices', element: <OfficeIndexPage /> },
            { path: '/offices/new', element: <OfficeCreatePage /> },
            { path: '/offices/edit/:id', element: <OfficeEditPage /> },

            // --- Employee Routes ---
            { path: '/employees', element: <EmployeeIndexPage /> },
            { path: '/employees/new', element: <EmployeeCreatePage /> },
            { path: '/employees/edit/:id', element: <EmployeeEditPage /> },

            // --- Asset Catalog Routes ---
            { path: '/catalog', element: <AssetCatalogIndexPage /> },
            { path: '/catalog/new', element: <AssetCatalogCreatePage /> },
            { path: '/catalog/edit/:id', element: <AssetCatalogEditPage /> },

            // --- Receiving Voucher Routes ---
            { path: '/vouchers', element: <ReceivingVoucherIndexPage /> },
            { path: '/vouchers/edit/:id', element: <ReceivingVoucherEditPage /> },

            // --- Equipment Routes ---
            { path: '/equipment', element: <EquipmentIndexPage /> },
            // --- MISSING ROUTES ADDED BELOW ---
            { path: '/equipment/new', element: <EquipmentReceivePage /> },
            { path: '/equipment/edit/:id', element: <EquipmentEditPage /> },
            { path: '/equipment/history/:id', element: <EquipmentHistoryPage /> },

            // --- Stock/Supplies Routes ---
            { path: '/supplies', element: <StockIndexPage /> },
            { path: '/stock/new', element: <StockAddPage /> },

            { path: '/settings', element: <Settings /> },
        ],
    },
];

export default routes;