import React, { useState } from 'react';
import {
  Calendar, Clock, User, Phone, Mail, Building,
  CheckCircle, ArrowUpRight, MapPin, Tag
} from 'lucide-react';
import { formatMetricValue } from './TargetMeterView';

export default function NextVisitsView({ data, configuration, onRefresh }) {
  if (!data) return null;

  const {
    today_count = 0,
    tomorrow_count = 0,
    next_day_date = null,
    next_day_count = 0,
    items = []
  } = data;

  // Default to 'today' if today has visits, else 'tomorrow' if tomorrow has visits, else 'today'
  const [filterTab, setFilterTab] = useState(
    today_count > 0 ? 'today' : (tomorrow_count > 0 ? 'tomorrow' : 'today')
  );

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

  const isItemToday = (item) => {
    if (item.visit_timing === 'today') return true;
    if (!item.next_visit) return false;
    const d = new Date(item.next_visit);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  };

  const isItemTomorrow = (item) => {
    if (item.visit_timing === 'tomorrow') return true;
    if (!item.next_visit) return false;
    const d = new Date(item.next_visit);
    const tom = new Date();
    tom.setDate(tom.getDate() + 1);
    return d.toDateString() === tom.toDateString();
  };

  // Filter items strictly for Today and/or Tomorrow
  let activeList = [];
  if (filterTab === 'today') {
    activeList = items.filter(item => isItemToday(item));
  } else if (filterTab === 'tomorrow') {
    activeList = items.filter(item => isItemTomorrow(item));
  } else {
    activeList = items.filter(item => isItemToday(item) || isItemTomorrow(item));
  }

  return (
    <div className="flex flex-col h-full space-y-3 p-1">
      {/* Top Metric Cards - Today & Tomorrow Only (2 Columns) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Today */}
        <div
          onClick={() => setFilterTab('today')}
          className={`p-3 rounded-xl border transition cursor-pointer ${
            filterTab === 'today'
              ? 'bg-emerald-50/90 border-emerald-400 ring-1 ring-emerald-400/50 shadow-xs'
              : 'bg-emerald-50/40 border-emerald-100 hover:bg-emerald-50/70 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 truncate">
              <span className={`w-2 h-2 rounded-full ${today_count > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-300'}`}></span>
              Today
            </span>
            <Calendar size={15} className="text-emerald-600 shrink-0" />
          </div>
          <div className="text-2xl font-black text-emerald-900 tracking-tight">
            {today_count}
          </div>
          <span className="text-[11px] text-emerald-700/80 font-medium">Scheduled Today</span>
        </div>

        {/* Tomorrow */}
        <div
          onClick={() => setFilterTab('tomorrow')}
          className={`p-3 rounded-xl border transition cursor-pointer ${
            filterTab === 'tomorrow'
              ? 'bg-blue-50/90 border-blue-400 ring-1 ring-blue-400/50 shadow-xs'
              : 'bg-blue-50/40 border-blue-100 hover:bg-blue-50/70 hover:border-blue-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5 truncate">
              <Clock size={12} className="text-blue-500 shrink-0" />
              Tomorrow
            </span>
            <Clock size={15} className="text-blue-600 shrink-0" />
          </div>
          <div className="text-2xl font-black text-blue-900 tracking-tight">
            {tomorrow_count}
          </div>
          <span className="text-[11px] text-blue-700/80 font-medium truncate block">
            Scheduled Tomorrow
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-1.5 pt-0.5 flex-wrap gap-1.5">
        <div className="flex items-center gap-1 text-xs flex-wrap">
          <button
            type="button"
            onClick={() => setFilterTab('today')}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              filterTab === 'today'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            Today ({today_count})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('tomorrow')}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              filterTab === 'tomorrow'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
            }`}
          >
            Tomorrow ({tomorrow_count})
          </button>
          {(today_count > 0 && tomorrow_count > 0) && (
            <button
              type="button"
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                filterTab === 'all'
                  ? 'bg-gray-800 text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              All ({today_count + tomorrow_count})
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
                : 'No visits scheduled for today or tomorrow'}
            </span>
            {today_count === 0 && tomorrow_count === 0 && next_day_date && (
              <p className="text-[11px] text-gray-500 mt-1">
                Next scheduled client visit is on <strong className="text-gray-800">{formatDate(next_day_date)}</strong> ({next_day_count} visit)
              </p>
            )}
          </div>
        ) : (
          activeList.map(item => {
            const isToday = isItemToday(item);
            const isTomorrow = isItemTomorrow(item);

            return (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition space-y-2 shadow-2xs hover:shadow-xs ${
                  isToday
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
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    <Clock size={11} />
                    {isToday
                      ? 'Today'
                      : isTomorrow
                      ? 'Tomorrow'
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
