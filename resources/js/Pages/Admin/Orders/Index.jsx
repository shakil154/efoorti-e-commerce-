import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import CourierRatioBreakdown from '@/Components/Admin/CourierRatioBreakdown';

/* ─── Badges ─────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    pending:   'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    shipped:   'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold rounded-full capitalize ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

function PaymentBadge({ status }) {
  const map = {
    pending:  'bg-amber-100 text-amber-700',
    verified: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    cod:      'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold rounded-full capitalize ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

function RiskBadge({ level, label }) {
  const norm = String(level || '').toLowerCase().replace('_risk', '');
  const map = {
    safe:   'bg-green-100 text-green-700 border-green-200',
    low:    'bg-blue-100 text-blue-700 border-blue-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    high:   'bg-red-100 text-red-700 border-red-200',
    danger: 'bg-rose-100 text-rose-700 border-rose-200',
  };
  const dotMap = {
    safe:   'bg-green-500',
    low:    'bg-blue-500',
    medium: 'bg-amber-500',
    high:   'bg-red-500',
    danger: 'bg-rose-500',
  };
  const cls = map[norm] || 'bg-gray-100 text-gray-600 border-gray-200';
  const dotCls = dotMap[norm] || 'bg-gray-400';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotCls}`} />
      {label || level}
    </span>
  );
}

function getCsrfToken() {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta ? meta.content : '';
}

/* ─── Tab config ─────────────────────────────────────────────────── */
const tabs = [
  { key: 'all',                   label: 'All Orders' },
  { key: 'pending_verification',  label: 'Pending Verification' },
  { key: 'confirmed',             label: 'Confirmed' },
  { key: 'shipped',               label: 'Shipped' },
  { key: 'delivered',             label: 'Delivered' },
  { key: 'cancelled',             label: 'Cancelled' },
];

/* ─── Main page ──────────────────────────────────────────────────── */
export default function OrdersIndex({ 
  orders, 
  status, 
  counts, 
  method: methodFilter, 
  dateFilter: dateFilterProp = 'all',
  fromDate: fromDateProp = '',
  toDate: toDateProp = '',
  q, 
  bdcourierConfigured = false 
}) {
  const { auth } = usePage().props;
  const user = auth?.user;
  const canDelete = user?.is_super_admin || user?.role === 'admin' || (user?.permissions || []).includes('orders.delete');
  const canManage = user?.is_super_admin || user?.role === 'admin' || (user?.permissions || []).includes('orders.manage');

  const [search, setSearch]                         = useState(q || '');
  const [selectedMethod, setSelectedMethod]         = useState(methodFilter || '');
  const [selectedDateFilter, setSelectedDateFilter] = useState(dateFilterProp || 'all');
  const [customFromDate, setCustomFromDate]         = useState(fromDateProp || '');
  const [customToDate, setCustomToDate]             = useState(toDateProp || '');
  const [selected, setSelected]                     = useState([]);
  const [bulkAction, setBulkAction]                 = useState('');
  const [noteModal, setNoteModal]                   = useState({ open: false, order: null, note: '' });
  const [copiedKey, setCopiedKey]                   = useState(null);
  const [toastMessage, setToastMessage]             = useState('');

  const copyText = (text, key, message = 'Copied to clipboard!') => {
    if (!text) return;
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text).catch(() => {
          fallbackCopy(text);
        });
      } else {
        fallbackCopy(text);
      }
    } catch (e) {
      fallbackCopy(text);
    }
    setCopiedKey(key);
    setToastMessage(message);
    setTimeout(() => setCopiedKey(null), 2000);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const fallbackCopy = (text) => {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    } catch (e) {}
  };

  // ── Quick Courier Ratio / Score Checker Modal ──
  const [courierModal, setCourierModal] = useState({ open: false, phone: '', customerName: '', loading: false, data: null, history: null, error: null });
  const [courierSearchPhone, setCourierSearchPhone] = useState('');

  const queryCourierPhone = async (phoneToQuery, name = '') => {
    const clean = (phoneToQuery || '').trim();
    if (!clean) return;
    setCourierSearchPhone(clean);
    setCourierModal(prev => ({ ...prev, open: true, phone: clean, customerName: name, loading: true, data: null, history: null, error: null }));

    try {
      const [fraudRes, histRes] = await Promise.all([
        fetch('/admin/orders/check-fraud', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': getCsrfToken(), 'Accept': 'application/json' },
          body: JSON.stringify({ phone: clean }),
        }).then(r => r.json()),
        fetch(`/admin/orders/customer-history?phone=${encodeURIComponent(clean)}`, {
          headers: { 'Accept': 'application/json' },
        }).then(r => r.json()),
      ]);

      setCourierModal(prev => ({
        ...prev,
        phone: clean,
        customerName: name,
        loading: false,
        data: fraudRes.error ? null : fraudRes,
        history: histRes,
        error: fraudRes.error || null,
      }));
    } catch (err) {
      setCourierModal(prev => ({ ...prev, loading: false, error: 'Could not fetch courier data. Check API settings.' }));
    }
  };

  const openCourierModal = (phone = '', name = '') => {
    if (phone) {
      queryCourierPhone(phone, name);
    } else {
      setCourierSearchPhone('');
      setCourierModal({ open: true, phone: '', customerName: '', loading: false, data: null, history: null, error: null });
    }
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    router.get('/admin/orders', { 
      status, 
      q: search, 
      method: selectedMethod,
      date_filter: selectedDateFilter,
      from_date: selectedDateFilter === 'custom' ? customFromDate : '',
      to_date: selectedDateFilter === 'custom' ? customToDate : '',
    }, { preserveState: true });
  };

  const handleFilter = (params) => {
    router.get('/admin/orders', { 
      status, 
      q: search, 
      method: selectedMethod,
      date_filter: selectedDateFilter,
      from_date: selectedDateFilter === 'custom' ? customFromDate : '',
      to_date: selectedDateFilter === 'custom' ? customToDate : '',
      ...params 
    }, { preserveState: true });
  };

  const handleClear = () => {
    setSearch('');
    setSelectedMethod('');
    setSelectedDateFilter('all');
    setCustomFromDate('');
    setCustomToDate('');
    router.get('/admin/orders', { status });
  };

  const handleTabChange = (key) => {
    router.get('/admin/orders', { 
      status: key,
      date_filter: selectedDateFilter !== 'all' ? selectedDateFilter : undefined,
      from_date: selectedDateFilter === 'custom' && customFromDate ? customFromDate : undefined,
      to_date: selectedDateFilter === 'custom' && customToDate ? customToDate : undefined,
      method: selectedMethod || undefined,
      q: search || undefined
    }, { preserveState: false });
  };

  const toggleSelect  = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll     = (e) => setSelected(e.target.checked ? orders.data.map(o => o.id) : []);

  const handleBulkApply = () => {
    if (!bulkAction || selected.length === 0) return;
    if (bulkAction === 'invoice') {
      window.open(`/admin/orders/invoices/bulk?ids=${selected.join(',')}`, '_blank');
      return;
    }
    window.showConfirm(
      `${bulkAction === 'delete' ? 'Delete' : bulkAction === 'verify' ? 'Verify' : 'Reject'} ${selected.length} order(s)?`,
      () => {
        router.post('/admin/orders/bulk', { ids: selected, bulk_action: bulkAction }, {
          onSuccess: () => { setSelected([]); setBulkAction(''); }
        });
      }
    );
  };

  const handleVerify = (orderId) => router.post(`/admin/orders/${orderId}/verify`);
  const handleReject = (orderId) => {
    window.showConfirm('Reject payment for this order?', () => router.post(`/admin/orders/${orderId}/reject`));
  };
  const handleDelete = (order) => {
    window.showConfirm(`Delete order ${order.order_number} permanently?`, () => router.delete(`/admin/orders/${order.id}`));
  };

  const [savingNote, setSavingNote] = useState(false);
  const handleSaveNote = (e) => {
    e?.preventDefault();
    if (!noteModal.order) return;
    setSavingNote(true);
    router.patch(`/admin/orders/${noteModal.order.id}`, {
      internal_note: noteModal.note,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setSavingNote(false);
        setNoteModal({ open: false, order: null, note: '' });
      },
      onError: () => {
        setSavingNote(false);
      }
    });
  };

  const activeTab = tabs.find(t => t.key === status) ? status : 'all';

  return (
    <>
      <Head title="Orders — Global Order Center" />
      <AdminLayout title="">
        <div className="space-y-5 w-full min-w-0">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Orders</h1>
              <p className="text-xs text-gray-500 mt-0.5">Manage customer orders, manual payments &amp; fulfillment</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openCourierModal('', '')}
                className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Check any customer's courier delivery history, fraud score, and carrier breakdown"
              >
                <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Check Courier Ratio</span>
              </button>
              <a href="/admin/orders/create"
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm shadow-orange-200">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Create Order
              </a>
            </div>
          </div>

          {/* ── Status Tabs ── */}
          <div className="flex items-center gap-1 border-b border-gray-100 overflow-x-auto">
            {tabs.map(tab => {
              const count = counts[tab.key] || 0;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {tab.label}
                  {count > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Main Orders Table Card ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Filter toolbar */}
            <form onSubmit={handleSearch} className="p-3.5 sm:p-4 border-b border-gray-50 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by order #, customer, phone, trx ID…"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                {/* Date Filter Dropdown */}
                <select
                  value={selectedDateFilter}
                  onChange={e => {
                    const val = e.target.value;
                    setSelectedDateFilter(val);
                    if (val !== 'custom') {
                      handleFilter({ date_filter: val, from_date: '', to_date: '' });
                    }
                  }}
                  className="flex-1 sm:flex-none text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 font-medium"
                >
                  <option value="all">All Time (Lifetime)</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="this_month">This Month</option>
                  <option value="last_month">Last Month</option>
                  <option value="1year">Last 1 Year</option>
                  <option value="custom">Custom Range…</option>
                </select>

                {/* Payment Method Filter */}
                <select
                  value={selectedMethod}
                  onChange={e => { setSelectedMethod(e.target.value); handleFilter({ method: e.target.value }); }}
                  className="flex-1 sm:flex-none text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                >
                  <option value="">All Methods</option>
                  <option value="cod">Cash on Delivery</option>
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="rocket">Rocket</option>
                </select>
              </div>

              {/* Custom Date Range Inputs if Custom Range selected */}
              {selectedDateFilter === 'custom' && (
                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs w-full sm:w-auto">
                  <input
                    type="date"
                    value={customFromDate}
                    onChange={e => setCustomFromDate(e.target.value)}
                    className="bg-transparent border-0 p-0.5 text-xs text-gray-700 focus:ring-0 focus:outline-none flex-1"
                    title="From Date"
                  />
                  <span className="text-gray-400 text-xs">to</span>
                  <input
                    type="date"
                    value={customToDate}
                    onChange={e => setCustomToDate(e.target.value)}
                    className="bg-transparent border-0 p-0.5 text-xs text-gray-700 focus:ring-0 focus:outline-none flex-1"
                    title="To Date"
                  />
                  <button
                    type="button"
                    onClick={() => handleFilter({ date_filter: 'custom', from_date: customFromDate, to_date: customToDate })}
                    className="px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button type="submit"
                  className="flex-1 sm:flex-none px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer text-center">
                  Search
                </button>
                {(search || selectedMethod || (selectedDateFilter && selectedDateFilter !== 'all')) && (
                  <button type="button" onClick={handleClear}
                    className="px-3 py-2 border border-gray-200 text-gray-500 hover:text-gray-700 rounded-xl text-xs font-medium transition-colors cursor-pointer">
                    Clear
                  </button>
                )}
              </div>
            </form>

            {/* Bulk action bar */}
            {selected.length > 0 && (
              <div className="px-4 sm:px-5 py-3 border-b border-gray-50 bg-orange-50 flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-semibold text-orange-700">{selected.length} selected</span>
                  <select value={bulkAction} onChange={e => setBulkAction(e.target.value)}
                    className="border border-orange-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm bg-white focus:outline-none font-medium">
                    <option value="">Choose action…</option>
                    <option value="invoice">Print Selected Invoices / Packing Slips</option>
                    <option value="verify">Verify payment</option>
                    <option value="reject">Reject payment</option>
                    {canDelete && <option value="delete">Delete</option>}
                  </select>
                  <button onClick={handleBulkApply} disabled={!bulkAction}
                    className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer">
                    Apply
                  </button>
                </div>
                <button onClick={() => setSelected([])} className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer">
                  Clear selection
                </button>
              </div>
            )}

            {/* ── Mobile Order Cards (block md:hidden) ── */}
            <div className="block md:hidden divide-y divide-gray-100">
              {orders.data?.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs">
                  No orders found in this section.
                </div>
              ) : (
                orders.data?.map(order => (
                  <div key={order.id} className="p-4 space-y-3 hover:bg-gray-50/50 transition-colors">
                    {/* Row 1: Checkbox + Order ID + Status Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selected.includes(order.id)}
                            onChange={() => toggleSelect(order.id)}
                            className="rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                          />
                          <a href={`/admin/orders/${order.id}`} className="font-bold text-orange-600 hover:underline font-mono text-sm">
                            #{order.order_number}
                          </a>
                        </div>

                        {/* Mobile Courier Consignment ID & Provider Badge */}
                        {(order.courier_provider || order.courier_tracking_code || order.courier_consignment_id) && (
                          <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-black uppercase bg-blue-50 text-blue-700 border border-blue-200">
                              {order.courier_provider || 'Courier'}
                            </span>
                            {(order.courier_consignment_id || order.courier_tracking_code) && (() => {
                              const val = order.courier_consignment_id || order.courier_tracking_code;
                              const displayVal = String(val).replace(/^CID-?/i, '');
                              const isCopied = copiedKey === `mob-cid-${order.id}`;
                              return (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyText(val, `mob-cid-${order.id}`, `Copied Courier ID: ${val}`);
                                  }}
                                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all border cursor-pointer shadow-2xs ${
                                    isCopied
                                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 ring-2 ring-emerald-400/20'
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                                  }`}
                                  title="Click to copy Courier ID"
                                >
                                  {isCopied ? (
                                    <>
                                      <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                      <span className="text-[9px] font-sans text-emerald-700 font-bold">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-[8.5px] text-slate-400 uppercase font-sans font-bold">CID:</span>
                                      <span>{displayVal}</span>
                                      <svg className="w-2.5 h-2.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                      </svg>
                                    </>
                                  )}
                                </button>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                      <StatusBadge status={order.status} />
                    </div>

                    {/* Row 2: Customer info + Phone with Click to Call */}
                    <div className="bg-gray-50/80 rounded-xl p-2.5 border border-gray-100/80 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-gray-900 text-xs truncate">{order.customer_name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <a href={`tel:${order.customer_phone}`} className="text-gray-600 hover:text-orange-600 text-xs font-mono flex items-center gap-1 font-medium">
                            <svg className="w-3 h-3 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {order.customer_phone}
                          </a>
                        </div>
                      </div>

                      <button
                        onClick={() => openCourierModal(order.customer_phone, order.customer_name)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold transition-colors border border-indigo-200 shrink-0 cursor-pointer"
                        title="Check Courier Delivery History & Fraud Score"
                      >
                        <svg className="w-3 h-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Courier Ratio
                      </button>
                    </div>

                    {/* Row 3: Order Summary (Items, Total, Payment, Date/Time) */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400 text-[11px] block">Items &amp; Total</span>
                        <div className="font-extrabold text-gray-900 text-sm mt-0.5">
                          ৳{Number(order.total).toLocaleString()} 
                          <span className="text-gray-400 text-[11px] font-normal ml-1.5">({order.items_count} items)</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="text-[11px] text-gray-500">{order.payment_method_label || order.payment_method}</span>
                          <PaymentBadge status={order.payment_status} />
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-gray-400 text-[11px] block">Date &amp; Time</span>
                        <div className="font-bold text-gray-800 text-xs mt-0.5">{order.created_at_formatted}</div>
                        <div className="text-[11px] text-gray-500 font-mono flex items-center justify-end gap-1 mt-0.5 font-medium">
                          <svg className="w-3.5 h-3.5 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{order.created_at_time || '—'}</span>
                        </div>
                        {order.created_at_human && (
                          <div className="text-[10px] text-gray-400 mt-0.5">{order.created_at_human}</div>
                        )}
                      </div>
                    </div>

                    {/* Courier tracking */}
                    {order.courier_tracking_code && (
                      <div className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                        <span className="font-bold uppercase text-[10px]">{order.courier_provider}:</span>
                        <span className="font-mono text-[11px]">{order.courier_tracking_code}</span>
                      </div>
                    )}

                    {/* Internal Note */}
                    {order.internal_note && (
                      <div 
                        onClick={() => setNoteModal({ open: true, order: order, note: order.internal_note || '' })}
                        className="p-2 bg-amber-50 rounded-lg border border-amber-100 text-amber-800 text-xs leading-snug flex items-start gap-1.5 cursor-pointer hover:bg-amber-100/80 transition-colors"
                        title="Click to edit staff note"
                      >
                        <svg className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                        </svg>
                        <span className="flex-1 line-clamp-2">{order.internal_note}</span>
                      </div>
                    )}

                    {/* Customer Delivery Note */}
                    {order.delivery_note && (
                      <div className="p-2 bg-yellow-50/80 rounded-lg border border-yellow-200 text-yellow-900 text-xs leading-snug flex items-start gap-1.5">
                        <svg className="w-3.5 h-3.5 shrink-0 mt-0.5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                        <span className="flex-1 line-clamp-2"><strong className="font-bold text-yellow-800">Note:</strong> {order.delivery_note}</span>
                      </div>
                    )}

                    {/* Row 4: Action buttons */}
                    <div className="pt-2 border-t border-gray-100 flex items-center gap-1.5 flex-wrap">
                      {order.payment_status === 'pending' && (
                        <>
                          <button onClick={() => handleVerify(order.id)} className="flex-1 min-w-[65px] py-1.5 px-2 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors text-center cursor-pointer">
                            Verify
                          </button>
                          <button onClick={() => handleReject(order.id)} className="flex-1 min-w-[65px] py-1.5 px-2 text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg font-semibold transition-colors text-center cursor-pointer">
                            Reject
                          </button>
                        </>
                      )}
                      <a href={`/admin/orders/${order.id}`} className="flex-1 min-w-[55px] py-1.5 px-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors text-center">
                        View
                      </a>
                      <a href={`/admin/orders/${order.id}/invoice`} target="_blank" rel="noreferrer" className="flex-1 min-w-[65px] py-1.5 px-2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors text-center flex items-center justify-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Invoice
                      </a>
                      {order.status !== 'delivered' && order.status !== 'cancelled' && !order.courier_tracking_code && (
                        <a href={`/admin/orders/${order.id}?ship=1`} className="flex-1 min-w-[55px] py-1.5 px-2 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 rounded-lg font-semibold transition-colors text-center flex items-center justify-center gap-1">
                          Ship
                        </a>
                      )}
                      <button 
                        onClick={() => setNoteModal({ open: true, order: order, note: order.internal_note || '' })}
                        className={`py-1.5 px-2.5 text-xs rounded-lg font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer ${order.internal_note ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}
                        title="Staff Note"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                        </svg>
                        Note
                      </button>
                      {canDelete && (
                        <button onClick={() => handleDelete(order)} className="py-1.5 px-2 text-xs bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 rounded-lg font-semibold transition-colors cursor-pointer" title="Delete Order">
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* ── Desktop Orders Table (hidden md:block) ── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm min-w-[960px]">
                <thead>
                  <tr className="text-left bg-gray-50/60 border-b border-gray-100">
                    <th className="px-3 2xl:px-5 py-3.5 w-10">
                      <input type="checkbox" onChange={toggleAll}
                        checked={selected.length === orders.data?.length && orders.data?.length > 0}
                        className="h-4 w-4 accent-orange-500 rounded cursor-pointer" />
                    </th>
                    <th className="px-3 2xl:px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">ORDER ID</th>
                    <th className="px-3 2xl:px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">CUSTOMER</th>
                    <th className="px-3 2xl:px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">ITEMS</th>
                    <th className="px-3 2xl:px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">TOTAL</th>
                    <th className="px-3 2xl:px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">PAYMENT</th>
                    <th className="px-3 2xl:px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">STATUS</th>
                    <th className="px-3 2xl:px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">DATE</th>
                    <th className="px-3 2xl:px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right whitespace-nowrap">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.data?.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center py-16 text-gray-400 text-xs">
                        No orders found in this section.
                      </td>
                    </tr>
                  )}
                  {orders.data?.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-3 2xl:px-5 py-3.5 align-top">
                        <input type="checkbox" checked={selected.includes(order.id)} onChange={() => toggleSelect(order.id)}
                          className="h-4 w-4 accent-orange-500 rounded cursor-pointer" />
                      </td>
                      <td className="px-3 2xl:px-5 py-3.5 align-top whitespace-nowrap">
                        <a href={`/admin/orders/${order.id}`} className="font-bold text-orange-600 hover:underline font-mono text-xs sm:text-sm">
                          #{order.order_number}
                        </a>

                        {/* Courier Consignment ID & Provider Badge */}
                        {(order.courier_provider || order.courier_tracking_code || order.courier_consignment_id) && (
                          <div className="mt-1.5 flex flex-col items-start gap-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
                                <svg className="w-3 h-3 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12"/>
                                </svg>
                                {order.courier_provider || 'Courier'}
                              </span>
                              {order.courier_status && (
                                <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-gray-100 text-gray-700 capitalize border border-gray-200">
                                  {order.courier_status.replace(/_/g, ' ')}
                                </span>
                              )}
                            </div>

                            {(order.courier_consignment_id || order.courier_tracking_code) && (() => {
                              const val = order.courier_consignment_id || order.courier_tracking_code;
                              const displayVal = String(val).replace(/^CID-?/i, '');
                              const isCopied = copiedKey === `cid-${order.id}`;
                              return (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyText(val, `cid-${order.id}`, `Copied Courier ID: ${val}`);
                                  }}
                                  className={`group inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-bold cursor-pointer transition-all shadow-2xs ${
                                    isCopied
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 ring-2 ring-emerald-400/20'
                                      : 'bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800'
                                  }`}
                                  title="Click to copy Courier Consignment ID / Tracking Code"
                                >
                                  {isCopied ? (
                                    <>
                                      <svg className="w-3.5 h-3.5 text-emerald-600 animate-in zoom-in-50 duration-150" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                      <span className="font-sans font-bold text-emerald-700 text-xs">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-[9px] text-slate-500 uppercase font-sans font-bold">CID:</span>
                                      <span>{displayVal}</span>
                                      <svg className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                      </svg>
                                    </>
                                  )}
                                </button>
                              );
                            })()}
                          </div>
                        )}
                      </td>
                      <td className="px-3 2xl:px-5 py-3.5 align-top min-w-[180px] max-w-sm xl:max-w-md">
                        <p className="font-bold text-gray-900 text-xs sm:text-sm">{order.customer_name}</p>
                        <p className="text-gray-500 text-xs font-mono">{order.customer_phone}</p>
                        
                        {/* Courier / Fraud Ratio Badge & Checker */}
                        <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => openCourierModal(order.customer_phone, order.customer_name)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10.5px] font-bold transition-colors border border-indigo-200 cursor-pointer shadow-2xs"
                            title="Check Courier Delivery History & Fraud Score"
                          >
                            <svg className="w-3 h-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Courier Ratio
                          </button>
                        </div>

                        {order.internal_note && (
                          <div 
                            onClick={() => setNoteModal({ open: true, order: order, note: order.internal_note || '' })}
                            className="mt-1.5 p-1.5 bg-amber-50 rounded border border-amber-100 text-amber-800 text-[11px] leading-tight flex items-start gap-1 max-w-xs xl:max-w-sm 2xl:max-w-md cursor-pointer hover:bg-amber-100/80 transition-colors" 
                            title={order.internal_note}
                          >
                            <svg className="w-3 h-3 shrink-0 mt-px opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                            </svg>
                            <span className="line-clamp-2">{order.internal_note}</span>
                          </div>
                        )}

                        {order.delivery_note && (
                          <div 
                            className="mt-1.5 p-1.5 bg-yellow-50/80 rounded border border-yellow-200 text-yellow-900 text-[11px] leading-tight flex items-start gap-1 max-w-xs xl:max-w-sm 2xl:max-w-md" 
                            title={`Delivery Note: ${order.delivery_note}`}
                          >
                            <svg className="w-3 h-3 shrink-0 mt-px text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                            <span className="line-clamp-2"><strong className="font-bold text-yellow-800">Note:</strong> {order.delivery_note}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-3 2xl:px-5 py-3.5 align-top text-gray-500 text-xs whitespace-nowrap">
                        {order.items_count} item(s)
                      </td>
                      <td className="px-3 2xl:px-5 py-3.5 align-top font-bold text-gray-900 whitespace-nowrap">
                        ৳{Number(order.total).toLocaleString()}
                      </td>
                      <td className="px-3 2xl:px-5 py-3.5 align-top whitespace-nowrap">
                        <p className="text-gray-500 text-xs mb-1">{order.payment_method_label || order.payment_method}</p>
                        <PaymentBadge status={order.payment_status} />
                      </td>
                      <td className="px-3 2xl:px-5 py-3.5 align-top whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-3 2xl:px-5 py-3.5 align-top text-xs whitespace-nowrap">
                        <div className="font-bold text-gray-900 text-xs">{order.created_at_formatted}</div>
                        <div className="text-[11px] text-gray-600 font-mono flex items-center gap-1 mt-0.5 font-medium">
                          <svg className="w-3.5 h-3.5 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{order.created_at_time || '—'}</span>
                        </div>
                        {order.created_at_human && (
                          <div className="text-[10px] text-gray-400 mt-0.5 font-normal">{order.created_at_human}</div>
                        )}
                      </td>
                      <td className="px-3 2xl:px-5 py-3.5 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap xl:flex-nowrap">
                          {order.payment_status === 'pending' && (
                            <>
                              <button onClick={() => handleVerify(order.id)}
                                className="px-2 py-1 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors cursor-pointer shadow-2xs">
                                Verify
                              </button>
                              <button onClick={() => handleReject(order.id)}
                                className="px-2 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg font-semibold transition-colors cursor-pointer">
                                Reject
                              </button>
                            </>
                          )}
                          <a href={`/admin/orders/${order.id}`}
                            className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors">
                            View
                          </a>
                          <a href={`/admin/orders/${order.id}/invoice`} target="_blank" rel="noreferrer"
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors inline-flex items-center justify-center shadow-2xs"
                            title="Print Invoice / Packing Slip">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                          </a>
                          {order.status !== 'delivered' && order.status !== 'cancelled' && !order.courier_tracking_code && (
                            <a href={`/admin/orders/${order.id}?ship=1`}
                              className="px-2 py-1 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 rounded-lg font-semibold transition-colors inline-flex items-center gap-1 shadow-2xs">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12"/>
                              </svg>
                              Ship
                            </a>
                          )}
                          <button onClick={() => setNoteModal({ open: true, order: order, note: order.internal_note || '' })}
                            className={`p-1.5 rounded-lg transition-colors inline-flex items-center justify-center cursor-pointer shadow-2xs ${order.internal_note ? 'bg-amber-100 hover:bg-amber-200 text-amber-800' : 'bg-gray-100 hover:bg-gray-200 text-gray-500 border border-gray-200'}`}
                            title={order.internal_note ? `Staff Note: ${order.internal_note}` : "Staff Note"}>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                            </svg>
                          </button>
                          {canDelete && (
                            <button onClick={() => handleDelete(order)}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center shadow-2xs"
                              title="Delete Order">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {orders.links && orders.links.length > 3 && (
              <div className="p-4 border-t border-gray-50 flex flex-wrap gap-1.5 items-center justify-center">
                {orders.links.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.url || '#'}
                    preserveScroll
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      link.active
                        ? 'bg-orange-500 text-white'
                        : link.url
                        ? 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        : 'text-gray-300 cursor-not-allowed'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

        </div>

        {/* ── 🔍 LIVE BD COURIER RATIO & FRAUD SCORE MODAL ── */}
        {courierModal.open && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-gray-100 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-sm sm:text-base">BD Courier Ratio &amp; Delivery Intelligence</h3>
                    <p className="text-xs text-gray-500">Live delivery records across Steadfast, Pathao, Paperfly &amp; RedX</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setCourierModal(prev => ({ ...prev, open: false }))} 
                  className="text-gray-400 hover:text-gray-700 text-lg p-1.5 rounded-lg hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              {/* Interactive Phone Search Bar */}
              <div className="flex items-center gap-2 pt-1">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={courierSearchPhone}
                    onChange={(e) => setCourierSearchPhone(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') queryCourierPhone(courierSearchPhone); }}
                    placeholder="Enter phone number (e.g. 017xxxxxxxx)..."
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 font-mono"
                  />
                  <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={() => queryCourierPhone(courierSearchPhone)}
                  disabled={courierModal.loading || !courierSearchPhone.trim()}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
                >
                  {courierModal.loading ? 'Checking...' : 'Check Ratio'}
                </button>
              </div>

              {courierModal.loading ? (
                <div className="py-14 flex flex-col items-center justify-center gap-3 text-gray-400">
                  <svg className="animate-spin w-9 h-9 text-indigo-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  <span className="text-xs font-bold text-gray-600">Querying live courier databases (Steadfast, Pathao, Paperfly, RedX)...</span>
                </div>
              ) : courierModal.error ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 space-y-2">
                  <p className="font-bold">Notice:</p>
                  <p>{courierModal.error}</p>
                  {!bdcourierConfigured && (
                    <p className="text-gray-600">You can configure your BD Courier API Key under <strong>Settings → Fraud Guard</strong> to enable full network-wide courier history checks.</p>
                  )}
                </div>
              ) : courierModal.data ? (
                <div className="space-y-4">
                  <CourierRatioBreakdown data={courierModal.data} />

                  {/* Shop Internal Order History */}
                  {courierModal.history && (() => {
                    const histSummary = courierModal.history?.summary || {};
                    const histTotal = histSummary.total ?? (courierModal.history?.orders?.length ?? 0);
                    const histDelivered = histSummary.delivered ?? 0;
                    const histCancelled = histSummary.cancelled ?? 0;
                    const histSuccessRate = histSummary.success_rate ?? (histTotal > 0 ? Math.round((histDelivered / histTotal) * 100) : 0);

                    return (
                      <div className="pt-3 border-t border-gray-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-700 uppercase">Your Store Order History</span>
                          <span className="text-xs text-gray-500 font-medium">
                            {histTotal} order(s) placed with your store
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2.5 py-1 rounded-lg bg-green-50 text-green-700 font-bold border border-green-100">
                            {histDelivered} Delivered ({histSuccessRate}%)
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 font-bold border border-red-100">
                            {histCancelled} Cancelled
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="py-10 text-center text-gray-400 text-xs">
                  Enter any customer phone number above and click &quot;Check Ratio&quot; to fetch delivery track record.
                </div>
              )}

              <div className="flex justify-end pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setCourierModal(prev => ({ ...prev, open: false }))}
                  className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Internal Note Modal ── */}
        {noteModal.open && noteModal.order && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-100 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                    ✎
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      Internal Note &mdash; <span className="font-mono text-orange-600">{noteModal.order.order_number}</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {noteModal.order.customer_name} ({noteModal.order.customer_phone})
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNoteModal({ open: false, order: null, note: '' })}
                  className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveNote} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Staff / Internal Note
                  </label>
                  <textarea
                    rows={4}
                    value={noteModal.note}
                    onChange={(e) => setNoteModal(prev => ({ ...prev, note: e.target.value }))}
                    placeholder="Write a private note for staff (e.g., Customer requested delivery after 5 PM, payment verified manually, etc.)..."
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-y"
                    autoFocus
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    * This note is visible only to store admins and staff. Not shown to customers.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  {noteModal.order.internal_note ? (
                    <button
                      type="button"
                      onClick={() => {
                        setNoteModal(prev => ({ ...prev, note: '' }));
                      }}
                      className="text-xs text-rose-500 hover:text-rose-700 font-medium cursor-pointer"
                    >
                      Clear Note
                    </button>
                  ) : <div />}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setNoteModal({ open: false, order: null, note: '' })}
                      className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingNote}
                      className="px-5 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {savingNote ? (
                        <>
                          <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>Save Note</span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Sleek Copied Toast Notice ── */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gray-900 text-white shadow-2xl text-xs font-semibold border border-gray-700/50 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span>{toastMessage}</span>
          </div>
        )}

      </AdminLayout>
    </>
  );
}
