<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $tab = $request->query('tab', 'registered'); // 'registered' | 'orders'
        $term = trim((string) $request->input('q'));

        // 1. Registered Customer Accounts (from users table excluding staff)
        $usersQuery = User::query()
            ->whereNotIn('role', User::STAFF_ROLES);

        if ($term) {
            $usersQuery->where(function ($q) use ($term) {
                $q->where('name', 'like', "%{$term}%")
                  ->orWhere('email', 'like', "%{$term}%")
                  ->orWhere('phone', 'like', "%{$term}%");
            });
        }

        $registeredCustomers = $usersQuery->latest('id')->paginate(20, ['*'], 'page')->withQueryString();

        // 2. Customers derived from placed orders (grouped by phone)
        $ordersQuery = Order::query()
            ->select('customer_name', 'customer_phone', 'customer_email')
            ->selectRaw('COUNT(*) as orders_count')
            ->selectRaw('SUM(total) as total_spent')
            ->selectRaw('MAX(created_at) as last_order_at')
            ->groupBy('customer_name', 'customer_phone', 'customer_email');

        if ($term) {
            $ordersQuery->where(function ($q) use ($term) {
                $q->where('customer_name', 'like', "%{$term}%")
                    ->orWhere('customer_phone', 'like', "%{$term}%");
            });
        }

        $orderCustomers = $ordersQuery->orderByDesc('last_order_at')->paginate(20, ['*'], 'page')->withQueryString();

        $stats = [
            'total_registered'      => User::whereNotIn('role', User::STAFF_ROLES)->count(),
            'total_order_customers' => Order::distinct('customer_phone')->count('customer_phone'),
        ];

        return Inertia::render('Admin/Customers/Index', [
            'customers'           => $tab === 'orders' ? $orderCustomers : $registeredCustomers,
            'currentTab'          => $tab,
            'term'                => $term,
            'stats'               => $stats,
        ]);
    }

    public function show(string $phone)
    {
        $orders = Order::where('customer_phone', $phone)->latest('id')->get();
        abort_if($orders->isEmpty(), 404);

        return Inertia::render('Admin/Customers/Show', [
            'orders'   => $orders,
            'customer' => $orders->first(),
        ]);
    }

    public function destroyUser($id)
    {
        $user = User::whereNotIn('role', User::STAFF_ROLES)->findOrFail($id);
        $user->delete();

        return back()->with('status', 'Customer account deleted successfully.');
    }
}
