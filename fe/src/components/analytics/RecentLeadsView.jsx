import React, { useState } from 'react';
import {
  Clock, Calendar, User, Phone, Mail, Building,
  TrendingUp, Sparkles, Tag, Search, ArrowRight, Layers,
  CalendarCheck
} from 'lucide-react';
import { formatMetricValue } from './TargetMeterView';

export default function RecentLeadsView({ data, configuration, onRefresh }) {
  const [filterTab, setFilterTab] = useState('all'); // 'all', '1_day', '2_days'
  const [searchQuery, setSearchQuery] = useState('');

  if (!data) return null;

  const {
    last_1_day_count = 0,
    last_1_day_value = 0,
    last_2_days_count = 0,
    last_2_days_value = 0,
    latest_lead_date = null,
    latest_day_count = 0,
    latest_day_value = 0,
    is_realtime = false,
    items = []
  } = data;

  const filteredItems = items.filter(item => {
    if (filterTab === '1_day') {
      if (item.age_tag !== 'today' && item.age_tag !== '1_day_ago') return false;
    } else if (filterTab === '2_days') {
      if (item.age_tag !== 'today' && item.age_tag !== '1_day_ago' && item.age_tag !== '2_days_ago') return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCompany = item.company_name?.toLowerCase().includes(q);
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchRep = item.assigned_to_name?.toLowerCase().includes(q);
      const matchDomain = item.domain_name?.toLowerCase().includes(q);
      return matchCompany || matchTitle || matchRep || matchDomain;
    }

    return true;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const isWeekendOrGap = last_1_day_count === 0 && last_2_days_count === 0;

  return (
    <div className="flex flex-col h-full space-y-3 p-1">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Last 1 Day Card */}
        <div
          onClick={() => setFilterTab(filterTab === '1_day' ? 'all' : '1_day')}
          className={`p-3 rounded-xl border transition cursor-pointer ${
            filterTab === '1_day'
              ? 'bg-blue-50/90 border-blue-400 ring-1 ring-blue-400/50 shadow-xs'
              : 'bg-blue-50/40 border-blue-100 hover:bg-blue-50/70 hover:border-blue-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1">
              <Clock size={12} className="text-blue-600" />
              Last 1 Day (24 hrs)
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
              {last_1_day_count} Leads
            </span>
          </div>
          <div className="text-xl font-black text-blue-950 tracking-tight">
            {formatMetricValue(last_1_day_value, '₹')}
          </div>
          <span className="text-[10px] text-blue-700/80 font-medium">New Pipeline Value</span>
        </div>

        {/* Last 2 Days OR Latest Batch Card */}
        <div
          onClick={() => setFilterTab(isWeekendOrGap ? 'all' : (filterTab === '2_days' ? 'all' : '2_days'))}
          className={`p-3 rounded-xl border transition cursor-pointer ${
            filterTab === '2_days'
              ? 'bg-indigo-50/90 border-indigo-400 ring-1 ring-indigo-400/50 shadow-xs'
              : 'bg-indigo-50/40 border-indigo-100 hover:bg-indigo-50/70 hover:border-indigo-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1 truncate" title={isWeekendOrGap && latest_lead_date ? `Latest: ${formatDate(latest_lead_date)}` : 'Last 2 Days (48 hrs)'}>
              {isWeekendOrGap ? <CalendarCheck size={12} className="text-indigo-600 shrink-0" /> : <Calendar size={12} className="text-indigo-600 shrink-0" />}
              {isWeekendOrGap && latest_lead_date ? `Latest: ${formatDate(latest_lead_date)}` : 'Last 2 Days (48 hrs)'}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 shrink-0">
              {isWeekendOrGap ? `${latest_day_count || items.length} Leads` : `${last_2_days_count} Leads`}
            </span>
          </div>
          <div className="text-xl font-black text-indigo-950 tracking-tight">
            {formatMetricValue(isWeekendOrGap ? (latest_day_value || 0) : last_2_days_value, '₹')}
          </div>
          <span className="text-[10px] text-indigo-700/80 font-medium">
            {isWeekendOrGap ? 'Latest Lead Intake' : 'Accumulated Pipeline'}
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2 pt-0.5 flex-wrap">
        <div className="flex items-center gap-1 text-xs flex-wrap">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              filterTab === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            All Recent ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('1_day')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              filterTab === '1_day'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-500 hover:text-blue-700 hover:bg-blue-50'
            }`}
          >
            Last 1 Day ({last_1_day_count})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('2_days')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              filterTab === '2_days'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-gray-500 hover:text-indigo-700 hover:bg-indigo-50'
            }`}
          >
            Last 2 Days ({last_2_days_count})
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative min-w-[140px] max-w-[200px]">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search leads..."
            className="w-full pl-7 pr-2.5 py-1 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-blue-400 transition"
          />
          <Search size={12} className="absolute left-2.5 top-2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Leads List */}
      <div className="flex-1 overflow-y-auto space-y-2 max-h-[380px] pr-1">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400">
            <Clock size={28} className="text-gray-300 mb-2" />
            <span className="text-xs font-semibold text-gray-700">
              {filterTab === '1_day' ? 'No leads added in the last 24 hours' : 'No leads added in the last 48 hours'}
            </span>
            {latest_lead_date && (
              <p className="text-[11px] text-gray-500 mt-1 mb-2">
                Most recent lead entry was on <strong className="text-gray-800">{formatDate(latest_lead_date)}</strong> ({latest_day_count} leads added)
              </p>
            )}
            <p className="text-[11px] text-gray-400 mt-0.5 mb-2.5">
              Explore recent opportunities below.
            </p>
            {items.length > 0 && (
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-100 transition flex items-center gap-1 mx-auto"
              >
                <span>View All Recent Leads ({items.length})</span>
                <ArrowRight size={12} />
              </button>
            )}
          </div>
        ) : (
          filteredItems.map(item => (
            <div
              key={item.id}
              className="p-3 rounded-xl border border-gray-100 hover:border-gray-200 bg-white hover:bg-slate-50/50 shadow-2xs hover:shadow-xs transition space-y-2"
            >
              {/* Header: Company & Stage Badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-gray-900 truncate">
                      {item.company_name || 'Individual Contact'}
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

                {/* Age Badge */}
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    item.age_tag === 'today'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : item.age_tag === '1_day_ago'
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : item.age_tag === '2_days_ago'
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  {item.age_tag === 'today'
                    ? 'Today'
                    : item.age_tag === '1_day_ago'
                    ? 'Yesterday'
                    : item.age_tag === '2_days_ago'
                    ? '2 Days Ago'
                    : formatDate(item.created_at)}
                </span>
              </div>

              {/* Contact & Value Footer */}
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
          ))
        )}
      </div>
    </div>
  );
}
