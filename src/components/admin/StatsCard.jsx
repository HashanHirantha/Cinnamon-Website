import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, trend, trendLabel, color = 'cinnamon' }) => {
    const isPositive = trend >= 0;

    const colorMap = {
        cinnamon: { bg: 'bg-cinnamon-100', iconBg: 'bg-cinnamon-600', iconText: 'text-white' },
        green: { bg: 'bg-green-50', iconBg: 'bg-green-600', iconText: 'text-white' },
        blue: { bg: 'bg-blue-50', iconBg: 'bg-blue-600', iconText: 'text-white' },
        gold: { bg: 'bg-amber-50', iconBg: 'bg-amber-500', iconText: 'text-white' },
        purple: { bg: 'bg-purple-50', iconBg: 'bg-purple-600', iconText: 'text-white' },
    };

    const c = colorMap[color] || colorMap.cinnamon;

    return (
        <div className="bg-white rounded-2xl shadow-card p-6 hover:shadow-card-hover transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${c.iconBg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${c.iconText}`} />
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                        {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
            <p className="text-sm text-gray-500">{title}</p>
            {trendLabel && <p className="text-xs text-gray-400 mt-1">{trendLabel}</p>}
        </div>
    );
};

export default StatsCard;
