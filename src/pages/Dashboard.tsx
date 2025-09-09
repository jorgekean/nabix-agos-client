import React from 'react';

// --- Icon Components for Stat Cards ---
const RevenueIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0l.879-.659M7 12l1.105-1.105c1.172-1.172 3.233-1.172 4.405 0L17 12" />
    </svg>
);

const SalesIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l.383-1.437M7.5 14.25L5.106 5.106A2.25 2.25 0 002.869 3H2.25" />
    </svg>
);

const StatCard = ({ title, value, change, changeType, icon: Icon }: { title: string, value: string, change: string, changeType: 'positive' | 'negative', icon: React.ElementType }) => {
    const changeColor = changeType === 'positive' ? 'text-green-500' : 'text-red-500';
    const iconBgColor = changeType === 'positive' ? 'bg-green-100 dark:bg-green-800' : 'bg-red-100 dark:bg-red-800';
    const iconColor = changeType === 'positive' ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300';

    return (
        <div className="rounded-xl bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">{title}</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-800 dark:text-white">{value}</p>
                    <p className={`mt-1 text-sm ${changeColor}`}>
                        {change} Since last month
                    </p>
                </div>
                <div className={`rounded-full p-3 ${iconBgColor}`}>
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>
            </div>
        </div>
    );
};


const Dashboard = () => {
    return (
        <>
            <h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>

            {/* Responsive Grid for Stat Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Revenue"
                    value="$2,450"
                    change="+11.01%"
                    changeType="positive"
                    icon={RevenueIcon}
                />
                <StatCard
                    title="Sales"
                    value="1,721"
                    change="-2.5%"
                    changeType="negative"
                    icon={SalesIcon}
                />
                {/* You can easily add more cards here */}
            </div>

            {/* You can add more dashboard sections below */}
            {/* For example, a chart or a recent activity table */}
        </>
    );
};

export default Dashboard;

