import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function CustomersIndex({ customers, term, currentTab = 'registered', stats }) {
  const [search, setSearch] = useState(term || '');
  const { data = [], links = [] } = customers || {};

  const handleSearch = () => {
    router.get('/admin/customers', { q: search, tab: currentTab }, { preserveState: true });
  };

  const switchTab = (tab) => {
    router.get('/admin/customers', { tab, q: search || undefined }, { preserveState: true });
  };

  const handleDeleteUser = (user) => {
    window.showConfirm(
      `Are you sure you want to permanently delete customer account "${user.name || user.email}"?`,
      () => {
        router.delete(`/admin/customers/user/${user.id}`);
      }
    );
  };

  return (
    <AdminLayout title="Customers">
      <Head title="Customer CRM" />

      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Customer CRM</h1>
            <p className="text-sm text-gray-500 mt-1">Manage registered customer accounts and order customer profiles.</p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div 
            onClick={() => switchTab('registered')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              currentTab === 'registered' ? 'bg-purple-50/50 border-purple-300 ring-2 ring-purple-200' : 'bg-white border-gray-100 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-gray-500 font-medium">Registered Customer Accounts</p>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">Users</span>
            </div>
            <p className="text-2xl font-black text-gray-900">{stats?.total_registered ?? 0}</p>
          </div>

          <div 
            onClick={() => switchTab('orders')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              currentTab === 'orders' ? 'bg-blue-50/50 border-blue-300 ring-2 ring-blue-200' : 'bg-white border-gray-100 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-gray-500 font-medium">Order Customers (By Phone)</p>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Purchased</span>
            </div>
            <p className="text-2xl font-black text-gray-900">{stats?.total_order_customers ?? 0}</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-gray-200 gap-2">
          <button
            onClick={() => switchTab('registered')}
            className={`pb-3 px-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              currentTab === 'registered'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>Registered Customer Accounts</span>
            <span className="px-1.5 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700 font-extrabold">{stats?.total_registered ?? 0}</span>
          </button>

          <button
            onClick={() => switchTab('orders')}
            className={`pb-3 px-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              currentTab === 'orders'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>Order Customers</span>
            <span className="px-1.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 font-extrabold">{stats?.total_order_customers ?? 0}</span>
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <form onSubmit={e => { e.preventDefault(); handleSearch(); }} className="p-4 border-b border-gray-50 flex flex-wrap gap-3">
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder={currentTab === 'registered' ? "Search customer name, email or phone…" : "Search customer name or phone…"}
              className="flex-1 min-w-[200px] border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" 
            />
            <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl transition-colors">
              Search
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/50">
                  {currentTab === 'registered' ? (
                    <>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide text-left">Customer</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide text-left">Email Address</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide text-left">Phone</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide text-left">City / Address</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide text-left">Registered Date</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide text-right">Actions</th>
                    </>
                  ) : (
                    <>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide text-left">Customer</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide text-left">Phone</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide text-left">Email</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide text-left">Orders</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide text-left">Total Spent</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide text-left">Last Order</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide text-right">Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={currentTab === 'registered' ? 6 : 7} className="px-5 py-12 text-center text-gray-400">
                      <span className="block text-4xl mb-2">👤</span>
                      <p className="font-semibold text-gray-600">No {currentTab === 'registered' ? 'registered customer accounts' : 'order customer profiles'} found.</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {currentTab === 'registered'
                          ? 'When customers create an account on your store, they will appear here.'
                          : 'When customers place orders, their phone-based profiles will appear here.'}
                      </p>
                    </td>
                  </tr>
                ) : data.map((customer, i) => (
                  <tr key={customer.id || i} className="hover:bg-gray-50/50 transition-colors">
                    {currentTab === 'registered' ? (
                      <>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs shrink-0">
                              {(customer.name || '?')[0].toUpperCase()}
                            </div>
                            <div>
                              <span className="font-semibold text-gray-800">{customer.name}</span>
                              <span className="block text-[11px] text-gray-400">ID #{customer.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-gray-600">{customer.email}</td>
                        <td className="px-5 py-3.5 text-gray-600">{customer.phone || '—'}</td>
                        <td className="px-5 py-3.5 text-gray-500 text-xs">
                          {customer.city ? `${customer.city}, ` : ''}{customer.address || '—'}
                        </td>
                        <td className="px-5 py-3.5 text-gray-400 text-xs">
                          {customer.created_at ? new Date(customer.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {customer.phone && (
                              <a 
                                href={`/admin/customers/${encodeURIComponent(customer.phone)}`} 
                                className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                              >
                                Orders
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(customer)}
                              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              title="Delete Customer Account"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                              {(customer.customer_name || '?')[0].toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-800">{customer.customer_name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-gray-600 font-medium">{customer.customer_phone}</td>
                        <td className="px-5 py-3.5 text-gray-500">{customer.customer_email || '—'}</td>
                        <td className="px-5 py-3.5">
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-600">{customer.orders_count}</span>
                        </td>
                        <td className="px-5 py-3.5 font-medium text-gray-800">৳{Number(customer.total_spent || 0).toLocaleString()}</td>
                        <td className="px-5 py-3.5 text-gray-400 text-xs">
                          {customer.last_order_at ? new Date(customer.last_order_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <a href={`/admin/customers/${encodeURIComponent(customer.customer_phone)}`} className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg font-medium transition-colors">
                            View Orders
                          </a>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {links && links.length > 3 && (
            <div className="p-4 border-t border-gray-50 flex flex-wrap gap-1.5 items-center justify-center">
              {links.map((link, i) => (
                link.url ? (
                  <button key={i} onClick={() => router.get(link.url)} className={`min-w-[36px] h-9 px-3 rounded-xl text-sm font-medium transition-colors ${link.active ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                ) : (
                  <span key={i} className="min-w-[36px] h-9 px-3 flex items-center justify-center text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: link.label }} />
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}