import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, Download } from "lucide-react";
import { toast } from "sonner";
import { listLeads, deleteLead } from "@/lib/leads.functions";
import { Card, ErrorState, GhostBtn } from "./adminUi";

function toCsv(rows: Array<Record<string, unknown>>): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");
}

export function AdminLeads() {
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["admin-leads"],
    queryFn: () => listLeads(),
  });

  const onDelete = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    try {
      await deleteLead({ data: { id } });
      await qc.invalidateQueries({ queryKey: ["admin-leads"] });
      toast.success("Deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const onExport = () => {
    const rows = q.data ?? [];
    if (rows.length === 0) {
      toast.info("No leads to export yet.");
      return;
    }
    const csv = toCsv(
      rows.map((r) => ({
        submitted_at: new Date(r.created_at).toISOString(),
        full_name: r.full_name,
        email: r.email,
        state: r.state,
        junior_ages: r.junior_ages,
        source: r.source,
      })),
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mgm-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (q.isPending) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <Loader2 className="size-4 animate-spin text-gold" /> Loading leads…
      </div>
    );
  }

  if (q.isError) {
    return <ErrorState error={q.error} />;
  }

  const rows = q.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display font-black uppercase text-xl text-navy tracking-tight">
            Sign-Ups ({rows.length})
          </h2>
          <p className="text-sm text-slate-500">
            Submissions from the /join page. Add <code>?src=fgw</code> to the URL to tag a source.
          </p>
        </div>
        <GhostBtn onClick={onExport}>
          <Download className="size-4 inline mr-1.5 -mt-0.5" />
          Export CSV
        </GhostBtn>
      </div>

      {rows.length === 0 ? (
        <Card>
          <p className="text-slate-500 text-sm">No sign-ups yet.</p>
        </Card>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <tr>
                  <th className="text-left px-4 py-3">Submitted</th>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">State</th>
                  <th className="text-left px-4 py-3">Ages</th>
                  <th className="text-left px-4 py-3">Source</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-semibold text-navy">{r.full_name}</td>
                    <td className="px-4 py-3">
                      <a href={`mailto:${r.email}`} className="text-navy hover:text-gold underline">
                        {r.email}
                      </a>
                    </td>
                    <td className="px-4 py-3">{r.state}</td>
                    <td className="px-4 py-3">{r.junior_ages}</td>
                    <td className="px-4 py-3 text-slate-500">{r.source || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onDelete(r.id)}
                        className="text-slate-400 hover:text-red-600"
                        aria-label="Delete lead"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}