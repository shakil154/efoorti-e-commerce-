import React, { useState } from 'react';

function RiskBadge({ level, label }) {
  const map = {
    safe:   { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80', dot: 'bg-emerald-500' },
    low:    { bg: 'bg-blue-50 text-blue-700 border-blue-200/80', dot: 'bg-blue-500' },
    medium: { bg: 'bg-amber-50 text-amber-700 border-amber-200/80', dot: 'bg-amber-500' },
    high:   { bg: 'bg-orange-50 text-orange-700 border-orange-200/80', dot: 'bg-orange-500' },
    danger: { bg: 'bg-rose-50 text-rose-700 border-rose-200/80', dot: 'bg-rose-500' },
  };
  const style = map[level] || { bg: 'bg-gray-50 text-gray-700 border-gray-200/80', dot: 'bg-gray-400' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      <span>{label || (level ? level.charAt(0).toUpperCase() + level.slice(1) : 'Safe')} Risk</span>
    </span>
  );
}

export default function CourierRatioBreakdown({ data, compact = false }) {
  const [showAllCouriers, setShowAllCouriers] = useState(false);

  if (!data) return null;

  const dataMap = data.data || {};
  const summary = dataMap.summary || {};

  const total = Number(summary.total_parcel ?? 0);
  const delivered = Number(summary.success_parcel ?? 0);
  const cancelled = Number(summary.cancelled_parcel ?? 0);
  const ratio = Number(data._success_ratio ?? (total > 0 ? (delivered / total) * 100 : 0));

  const level = data.risk_verdict?.level || data._risk_level || 'safe';
  const label = data.risk_verdict?.label || data._risk_label || 'Safe';
  const action = data.risk_verdict?.action || '';
  const reports = data.reports || [];

  // Parse couriers
  const courierList = Object.entries(dataMap)
    .filter(([key, val]) => key !== 'summary' && typeof val === 'object' && val !== null && ('total_parcel' in val))
    .map(([key, val]) => {
      const cTot = Number(val.total_parcel ?? 0);
      const cDel = Number(val.success_parcel ?? 0);
      const cRet = Number(val.cancelled_parcel ?? 0);
      const cRatio = Number(val.success_ratio ?? (cTot > 0 ? Math.round((cDel / cTot) * 100) : 0));
      return {
        key: key.toLowerCase(),
        name: val.name || key.charAt(0).toUpperCase() + key.slice(1),
        logo: val.logo || null,
        total: cTot,
        delivered: cDel,
        cancelled: cRet,
        ratio: cRatio,
      };
    });

  const activeCouriers = courierList.filter(c => c.total > 0).sort((a, b) => b.total - a.total);
  const zeroCouriers = courierList.filter(c => c.total === 0);

  return (
    <div className={`space-y-3 text-gray-800 ${compact ? 'text-xs' : ''}`}>
      {/* ── 1. Minimal Header / Risk Indicator ── */}
      <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 bg-gray-50/80 rounded-xl border border-gray-100">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <RiskBadge level={level} label={label} />
          <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
            {total > 0 ? `${ratio.toFixed(0)}% Delivery Rate` : 'No Courier Record'}
          </span>
        </div>
        {action && (
          <span className="text-[11px] font-medium text-gray-500 bg-white px-2 py-0.5 rounded-md border border-gray-200/60 shrink-0">
            {action}
          </span>
        )}
      </div>

      {/* ── 2. Compact 3-Stat Strip ── */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
        <div className="bg-white rounded-xl py-2 px-1 sm:p-2.5 border border-gray-100 shadow-2xs">
          <p className="text-sm sm:text-base font-bold text-gray-900 leading-none">{total}</p>
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mt-1">Total</p>
        </div>
        <div className="bg-white rounded-xl py-2 px-1 sm:p-2.5 border border-gray-100 shadow-2xs">
          <p className="text-sm sm:text-base font-bold text-emerald-600 leading-none flex items-center justify-center gap-1">
            <svg className="w-3 h-3 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{delivered}</span>
          </p>
          <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider mt-1">Delivered</p>
        </div>
        <div className="bg-white rounded-xl py-2 px-1 sm:p-2.5 border border-gray-100 shadow-2xs">
          <p className="text-sm sm:text-base font-bold text-rose-600 leading-none flex items-center justify-center gap-1">
            <svg className="w-3 h-3 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>{cancelled}</span>
          </p>
          <p className="text-[10px] font-medium text-rose-600 uppercase tracking-wider mt-1">Returned</p>
        </div>
      </div>

      {/* ── 3. Clean Courier Breakdown List ── */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-[11px] font-medium text-gray-400 px-0.5">
          <span>Courier Breakdown</span>
          <span>{activeCouriers.length} Active</span>
        </div>

        {activeCouriers.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            No parcel history found in BD couriers database.
          </p>
        ) : (
          <div className="space-y-2">
            {activeCouriers.map((c) => {
              const isSafe = c.ratio >= 75;
              const isMid = c.ratio >= 50 && c.ratio < 75;
              return (
                <div
                  key={c.key}
                  className="bg-white rounded-xl p-2.5 sm:p-3 border border-gray-100 hover:border-gray-200 transition-colors shadow-2xs space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-1.5 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {c.logo ? (
                        <img
                          src={c.logo}
                          alt={c.name}
                          className="w-4 h-4 sm:w-5 sm:h-5 object-contain rounded shrink-0 bg-gray-50 p-0.5"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                      )}
                      <span className="text-xs font-semibold text-gray-800 truncate">{c.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[11px] text-gray-500 font-mono">
                        <span className="text-emerald-600 font-semibold">{c.delivered}</span>
                        <span className="text-gray-300 mx-0.5">/</span>
                        <span className="text-gray-700">{c.total}</span>
                        {c.cancelled > 0 && (
                          <span className="text-rose-500 ml-1">({c.cancelled})</span>
                        )}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isSafe ? 'bg-emerald-50 text-emerald-700' : isMid ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {c.ratio}%
                      </span>
                    </div>
                  </div>

                  {/* Dual progress bar */}
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${c.ratio}%` }}
                    />
                    <div
                      className="bg-rose-400 h-full transition-all duration-300"
                      style={{ width: `${100 - c.ratio}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Collapsible zero-parcel couriers */}
        {zeroCouriers.length > 0 && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowAllCouriers(!showAllCouriers)}
              className="text-[11px] text-gray-400 hover:text-gray-600 font-medium flex items-center gap-1 transition-colors"
            >
              <span>{showAllCouriers ? 'Hide other couriers' : `+ ${zeroCouriers.length} couriers with 0 parcels`}</span>
              <svg className={`w-3 h-3 transition-transform ${showAllCouriers ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showAllCouriers && (
              <div className="flex flex-wrap gap-1 pt-1.5">
                {zeroCouriers.map((zc) => (
                  <span key={zc.key} className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
                    {zc.name}: 0
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 4. Merchant Fraud Reports (If Any) ── */}
      {reports.length > 0 && (
        <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-3 text-xs text-rose-800 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-rose-900">
            <svg className="w-3.5 h-3.5 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{reports.length} Merchant Report(s) on File</span>
          </div>
          <ul className="space-y-1 text-[11px] pl-4 list-disc text-rose-700">
            {reports.map((r, idx) => (
              <li key={idx}>
                {r.details || 'Customer reported for refused/fraudulent parcel'}
                {r.courierName && <span className="font-mono ml-1 text-rose-500">({r.courierName})</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
