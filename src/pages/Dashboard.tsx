import React from 'react';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { StatCard } from '../components/dashboard/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Laptop, Box, Archive, AlertTriangle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const { stats, isLoading } = useDashboardStats();

    if (isLoading) {
        return <div className="p-6">Loading Dashboard...</div>;
    }

    return (
        <div className="p-4 md:p-2 space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            {/* --- Stat Cards Section --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Equipment" value={stats.totalEquipment} icon={<Laptop size={24} />} />
                <StatCard title="Supplies in Stock" value={stats.suppliesInStock} icon={<Box size={24} />} />
                <StatCard title="Assets in Storage" value={stats.assetsInStorage} icon={<Archive size={24} />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* --- Left Column: Chart & Low Stock --- */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Equipment by Office Chart */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Equipment by Office</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#f97316" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Low Stock Alerts */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4 flex items-center">
                            <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                            Low Stock Alerts
                        </h2>
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {stats.lowStockAlerts.length > 0 ? stats.lowStockAlerts.map((item: any) => (
                                <li key={item.stockID} className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{item.catalogItem.name}</p>
                                        <p className="text-sm text-gray-500">{item.office.officeName}</p>
                                    </div>
                                    <p className="text-red-500 font-bold">{item.quantityOnHand} left</p>
                                </li>
                            )) : <p className="text-sm text-gray-500">No low stock items. Great job!</p>}
                        </ul>
                    </div>
                </div>

                {/* --- Right Column: Recent Activity --- */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-gray-500" />
                        Recent Activity
                    </h2>
                    <ul className="space-y-4">
                        {stats.recentActivity.map((item: any) => (
                            <li key={item.transactionID} className="text-sm">
                                <p className="font-medium text-gray-800 dark:text-gray-100">{item.action}</p>
                                <p className="text-gray-500 dark:text-gray-400">{item.notes}</p>
                                <p className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;