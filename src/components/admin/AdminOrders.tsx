import { useQuery } from "@tanstack/react-query";
import { listOrders } from "@/lib/admin.functions";

function formatAmount(cents: number, currency: string): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: currency.toUpperCase() || "USD",
  });
}

export function AdminOrders() {
  const q = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: () => listOrders(),
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-navy text-xl">Orders</h2>
        <p className="text-sm text-slate-500 mt-1">
          Recorded automatically when Stripe confirms a payment. Nothing to edit here.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500">
            <tr>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Customer</th>
              <th className="text-left px-4 py-3">Items</th>
              <th className="text-right px-4 py-3">Total</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {q.data?.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                  {new Date(o.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-navy font-medium">
                  <div>{o.customer_name || "—"}</div>
                  <div className="text-xs text-slate-400">{o.customer_email}</div>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {o.items.map((it, i) => (
                    <div key={i}>
                      {it.quantity}× {it.name}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-3 text-right font-bold text-navy whitespace-nowrap">
                  {formatAmount(o.amount_total, o.currency)}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex text-[10px] font-bold uppercase tracking-widest bg-green-100 text-green-700 px-2 py-1 rounded">
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
            {q.data?.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-400">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
