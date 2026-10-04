<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Convert old long alphanumeric order numbers (ORD-xxxxxx-xxxx) to clean numeric sequential numbers (e.g. 1, 2, 32...).
     */
    public function up(): void
    {
        $orders = DB::table('orders')->orderBy('id', 'asc')->get(['id', 'order_number']);

        foreach ($orders as $order) {
            // If it starts with ORD- or is not purely numeric, assign its ID as order number
            if (str_starts_with($order->order_number, 'ORD-') || ! ctype_digit((string) $order->order_number)) {
                DB::table('orders')->where('id', $order->id)->update([
                    'order_number' => (string) $order->id,
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Non-destructive: no need to revert simple numbers back to random hashes
    }
};
