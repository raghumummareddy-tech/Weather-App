import React, { useState } from 'react';
import { Sparkles, ShieldAlert, CheckCircle2, Umbrella, Flame, Sun, Snowflake, Wind, Shirt, Activity, Compass, Info } from 'lucide-react';
import { PlanningRecommendation } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface RecommendationsGridProps {
  recommendations: PlanningRecommendation[];
}

export const RecommendationsGrid: React.FC<RecommendationsGridProps> = ({ recommendations }) => {
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? recommendations : recommendations.filter((r) => r.category === filter);

  const getVariantStyles = (variant: PlanningRecommendation['variant']) => {
    switch (variant) {
      case 'danger':
        return {
          cardBg: 'bg-rose-950/40 border-rose-800/60 hover:border-rose-600',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          iconBg: 'bg-rose-500/20 text-rose-400',
          accentColor: 'text-rose-400',
        };
      case 'warning':
        return {
          cardBg: 'bg-amber-950/40 border-amber-800/60 hover:border-amber-600',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          iconBg: 'bg-amber-500/20 text-amber-400',
          accentColor: 'text-amber-400',
        };
      case 'success':
        return {
          cardBg: 'bg-emerald-950/40 border-emerald-800/60 hover:border-emerald-600',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          iconBg: 'bg-emerald-500/20 text-emerald-400',
          accentColor: 'text-emerald-400',
        };
      case 'primary':
        return {
          cardBg: 'bg-sky-950/40 border-sky-800/60 hover:border-sky-600',
          badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
          iconBg: 'bg-sky-500/20 text-sky-400',
          accentColor: 'text-sky-400',
        };
      case 'info':
      default:
        return {
          cardBg: 'bg-indigo-950/40 border-indigo-800/60 hover:border-indigo-600',
          badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
          iconBg: 'bg-indigo-500/20 text-indigo-400',
          accentColor: 'text-indigo-400',
        };
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 my-6">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Sparkles className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Smart Planning Recommendations
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Intelligent weather insights & actionable outdoor guidance for your day
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
            {[
              { id: 'all', label: 'All Insights' },
              { id: 'essential', label: 'Essentials' },
              { id: 'activity', label: 'Outdoors' },
              { id: 'health', label: 'Health' },
              { id: 'clothing', label: 'Gear' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                  filter === tab.id
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Recommendation Cards */}
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">
            No specific recommendations found for this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => {
              const styles = getVariantStyles(item.variant);
              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border ${styles.cardBg} backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between gap-4`}
                >
                  <div className="space-y-3">
                    {/* Top Header line */}
                    <div className="flex items-center justify-between gap-2">
                      <div className={`p-2.5 rounded-xl ${styles.iconBg}`}>
                        <WeatherIcon name={item.iconName} size={22} />
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${styles.badgeBg}`}
                      >
                        {item.badgeText}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Actionable Tip Box */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs font-medium text-slate-200 bg-slate-900/60 p-2.5 rounded-xl">
                    <Info className={`w-4 h-4 shrink-0 mt-0.5 ${styles.accentColor}`} />
                    <span>{item.actionableTip}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
