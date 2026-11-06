import React, { useState } from 'react';
import {
  Calendar, Clock, User, Phone, Mail, Building,
  CheckCircle, ArrowUpRight, Sparkles, MapPin, Tag,
  AlertTriangle, ArrowRight
} from 'lucide-react';
import { formatMetricValue } from './TargetMeterView';

export default function NextVisitsView({ data, configuration, onRefresh }) {
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'today', 'tomorrow', 'next_7_days', 'overdue'

  if (!data) return null;

  const {
    today_count = 0,
    tomorrow_count = 0,
    upcoming_count = 0,
    overdue_count = 0,
    next_day_date = null,
    next_day_count = 0,
    next_7_days_count = 0,
    total_count = 0,
    items = [],
    overdue_items = []
  } = data;

  const displayTotal = upcoming_count || total_count;

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Determine active items list based on selected filterTab
  let activeList = items;
  if (filterTab === 'overdue') {
    activeList = overdue_items.length > 0 ? overdue_items : items.filter(i => i.visit_timing === 'overdue');
  } else if (filterTab === 'today') {
    activeList = items.filter(item => item.visit_timing === 'today');
  } else if (filterTab === 'tomorrow') {
    activeList = items.filter(item => item.visit_timing === 'tomorrow');
  } else if (filterTab === 'next_7_days') {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    activeList = items.filter(item => {
      if (!item.next_visit) return false;
      const d = new Date(item.next_visit);
      return d >= now && d <= nextWeek;
    });
  }

  // Label for next working day
  const nextScheduledLabel = next_day_date ? formatDate(next_day_date) : 'Upcoming';

  return (
    <div className="flex flex-col h-full space-y-3 p-1">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Today */}
        <div
          onClick={() => setFilterTab(filterTab === 'today' ? 'all' : 'today')}
          className={`p-2.5 rounded-xl border transition cursor-pointer ${
            filterTab === 'today'
              ? 'bg-emerald-50/90 border-emerald-400 ring-1 ring-emerald-400/50 shadow-xs'
              : 'bg-emerald-50/40 border-emerald-100 hover:bg-emerald-50/70 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1 truncate">
              <span className={`w-2 h-2 rounded-full ${today_count > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-300'}`}></span>
              Today
            </span>
            <Calendar size={13} className="text-emerald-600 shrink-0" />
          </div>
          <div className="text-2xl font-black text-emerald-900 tracking-tight">
            {today_count}
          </div>
          <span className="text-[10px] text-emerald-700/80 font-medium">Scheduled Today</span>
        </div>

        {/* Tomorrow or Next Scheduled Working Day */}
        <div
          onClick={() => setFilterTab(tomorrow_count > 0 ? (filterTab === 'tomorrow' ? 'all' : 'tomorrow') : 'all')}
          className={`p-2.5 rounded-xl border transition cursor-pointer ${
            filterTab === 'tomorrow'
              ? 'bg-blue-50/90 border-blue-400 ring-1 ring-blue-400/50 shadow-xs'
              : 'bg-blue-50/40 border-blue-100 hover:bg-blue-50/70 hover:border-blue-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1 truncate" title={tomorrow_count > 0 ? 'Tomorrow' : `Next: ${nextScheduledLabel}`}>
              <Clock size={11} className="text-blue-500 shrink-0" />
              {tomorrow_count > 0 ? 'Tomorrow' : nextScheduledLabel}
            </span>
            <Clock size={13} className="text-blue-600 shrink-0" />
          </div>
          <div className="text-2xl font-black text-blue-900 tracking-tight">
            {tomorrow_count > 0 ? tomorrow_count : next_day_count}
          </div>
          <span className="text-[10px] text-blue-700/80 font-medium truncate block">
            {tomorrow_count > 0 ? 'Scheduled Tomorrow' : 'Next Scheduled'}
          </span>
        </div>

        {/* All Upcoming */}
        <div
          onClick={() => setFilterTab('all')}
          className={`p-2.5 rounded-xl border transition cursor-pointer ${
            filterTab === 'all'
              ? 'bg-purple-50/90 border-purple-400 ring-1 ring-purple-400/50 shadow-xs'
              : 'bg-purple-50/40 border-purple-100 hover:bg-purple-50/70 hover:border-purple-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider truncate">
              All Upcoming
            </span>
            <Sparkles size={13} className="text-purple-600 shrink-0" />
          </div>
          <div className="text-2xl font-black text-purple-950 tracking-tight">
            {displayTotal}
          </div>
          <span className="text-[10px] text-purple-700/80 font-medium">Total Pipeline</span>
        </div>

        {/* Overdue Action */}
        <div
          onClick={() => setFilterTab(filterTab === 'overdue' ? 'all' : 'overdue')}
          className={`p-2.5 rounded-xl border transition cursor-pointer ${
            filterTab === 'overdue'
              ? 'bg-amber-50/90 border-amber-400 ring-1 ring-amber-400/50 shadow-xs'
              : overdue_count > 0
              ? 'bg-amber-50/40 border-amber-200 hover:bg-amber-50/70'
              : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 truncate ${overdue_count > 0 ? 'text-amber-800' : 'text-slate-600'}`}>
              <AlertTriangle size={11} className={overdue_count > 0 ? 'text-amber-600' : 'text-slate-400'} />
              Overdue
            </span>
            <AlertTriangle size={13} className={overdue_count > 0 ? 'text-amber-600' : 'text-slate-400'} />
          </div>
          <div className={`text-2xl font-black tracking-tight ${overdue_count > 0 ? 'text-amber-950' : 'text-slate-800'}`}>
            {overdue_count}
          </div>
          <span className={`text-[10px] font-medium truncate block ${overdue_count > 0 ? 'text-amber-700' : 'text-slate-400'}`}>
            {overdue_count > 0 ? 'Needs Follow-up' : 'All Up to Date'}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-1.5 pt-0.5 flex-wrap gap-1.5">
        <div className="flex items-center gap-1 text-xs flex-wrap">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              filterTab === 'all'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            All Upcoming ({displayTotal})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('today')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              filterTab === 'today'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-500 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            Today ({today_count})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('tomorrow')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              filterTab === 'tomorrow'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-500 hover:text-blue-700 hover:bg-blue-50'
            }`}
          >
            Tomorrow ({tomorrow_count})
          </button>
          {next_7_days_count > 0 && (
            <button
              type="button"
              onClick={() => setFilterTab('next_7_days')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                filterTab === 'next_7_days'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-gray-500 hover:text-indigo-700 hover:bg-indigo-50'
              }`}
            >
              Next 7 Days ({next_7_days_count})
            </button>
          )}
          {overdue_count > 0 && (
            <button
              type="button"
              onClick={() => setFilterTab('overdue')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                filterTab === 'overdue'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              Overdue ({overdue_count})
            </button>
          )}
        </div>
      </div>

      {/* Leads List */}
      <div className="flex-1 overflow-y-auto space-y-2 max-h-[360px] pr-1">
        {activeList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400">
            <Calendar size={28} className="text-gray-300 mb-2" />
            <span className="text-xs font-semibold text-gray-700">
              {filterTab === 'today'
                ? 'No visits scheduled for today'
                : filterTab === 'tomorrow'
                ? 'No visits scheduled for tomorrow'
                : filterTab === 'overdue'
                ? 'No overdue visits pending'
                : 'No visits found in schedule'}
            </span>
            {next_day_date && (filterTab === 'today' || filterTab === 'tomorrow') && (
              <p className="text-[11px] text-gray-500 mt-1 mb-2">
                Next scheduled client visit is on <strong className="text-gray-800">{nextScheduledLabel}</strong> ({next_day_count} visit)
              </p>
            )}
            <p className="text-[11px] text-gray-400 mt-0.5 mb-2.5">
              {filterTab !== 'all' && displayTotal > 0
                ? `You have ${displayTotal} upcoming scheduled visits in the calendar.`
                : 'No visits found in this timeframe.'}
            </p>
            {filterTab !== 'all' && displayTotal > 0 && (
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-xs font-bold hover:bg-purple-100 transition flex items-center gap-1 mx-auto"
              >
                <span>View All {displayTotal} Upcoming Visits</span>
                <ArrowRight size={12} />
              </button>
            )}
          </div>
        ) : (
          activeList.map(item => {
            const isToday = item.visit_timing === 'today';
            const isTomorrow = item.visit_timing === 'tomorrow';
            const isOverdue = item.visit_timing === 'overdue';

            return (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition space-y-2 shadow-2xs hover:shadow-xs ${
                  isOverdue
                    ? 'border-amber-200 bg-amber-50/20 hover:bg-amber-50/40'
                    : isToday
                    ? 'border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50/40'
                    : 'border-gray-100 hover:border-gray-200 bg-white hover:bg-slate-50/50'
                }`}
              >
                {/* Title & Timing Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-gray-900 truncate">
                        {item.company_name || 'Individual Prospect'}
                      </span>
                      {item.domain_name && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          {item.domain_name}
                        </span>
                      )}
                      {item.stage_name && (
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                          style={{
                            backgroundColor: `${item.stage_color || '#3b82f6'}15`,
                            color: item.stage_color || '#3b82f6',
                            borderColor: `${item.stage_color || '#3b82f6'}30`,
                            borderWidth: '1px'
                          }}
                        >
                          {item.stage_name}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                      {item.title}
                    </div>
                  </div>

                  {/* Visit Timing Badge */}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 shrink-0 ${
                      isToday
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : isTomorrow
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : isOverdue
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}
                  >
                    <Clock size={11} />
                    {isToday
                      ? 'Today'
                      : isTomorrow
                      ? 'Tomorrow'
                      : isOverdue
                      ? `Overdue (${formatDate(item.next_visit)})`
                      : formatDate(item.next_visit)}
                  </span>
                </div>

                {/* Details Footer */}
                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-50">
                  <div className="flex items-center gap-3">
                    {item.assigned_to_name && (
                      <span className="flex items-center gap-1 text-gray-700 font-medium">
                        <User size={11} className="text-gray-400" />
                        {item.assigned_to_name}
                      </span>
                    )}
                    {item.contact_name && (
                      <span className="text-gray-400 text-[10px] hidden sm:inline">
                        • {item.contact_name}
                      </span>
                    )}
                  </div>

                  <div className="font-bold text-xs text-gray-900">
                    {formatMetricValue(item.estimated_value || 0, '₹')}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
