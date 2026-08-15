import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, Reply, Mail } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/AdminLayout";
import { DataTableShell, EmptyState } from "@/components/admin/DataTableShell";
import { useFirestoreCollection } from "@/hooks/use-firestore-collection";
import { formatAdminDateTime } from "@/lib/format-date";

type AdminMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: number;
  read: boolean;
};
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/messages")({
  component: MessagesPage,
});

function MessagesPage() {
  const { items, loading, edit, remove: removeMsg } = useFirestoreCollection<AdminMessage>("messages");
  const [view, setView] = useState<AdminMessage | null>(null);
  const [reply, setReply] = useState("");

  function remove(id: string) {
    removeMsg(id);
  }

  function openView(m: AdminMessage) {
    setView(m);
    if (!m.read) edit(m.id, { read: true });
  }

  function sendReply() {
    if (!reply.trim()) return;
    toast.success(`Reply sent to ${view?.name}`);
    setReply("");
    setView(null);
  }

  return (
    <div>
      <PageHeader title="Contact Messages" subtitle="Inbox from your website contact form." />
      <DataTableShell>
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState title="Inbox is empty" />
        ) : (
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-3 px-4">From</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Received</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((m) => (
                <tr key={m.id} className="hover:bg-muted/40">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {!m.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                      <div>
                        <p className="font-semibold">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{m.subject}</td>
                  <td className="py-3 px-4 text-muted-foreground">{formatAdminDateTime(m.createdAt)}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openView(m)} aria-label="View">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => remove(m.id)}
                        aria-label="Delete"
                        className="text-primary"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </DataTableShell>

      <Dialog open={!!view} onOpenChange={(v) => !v && setView(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{view?.subject}</DialogTitle>
            <DialogDescription>
              From <span className="font-semibold text-foreground">{view?.name}</span> · {view?.email}
            </DialogDescription>
          </DialogHeader>
          <p className="rounded-xl bg-muted p-4 text-sm">{view?.message}</p>
          <div className="grid gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Reply</p>
            <Textarea rows={4} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write your response…" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setView(null)}>Close</Button>
            <Button onClick={sendReply} className="gap-1.5"><Reply className="h-4 w-4" /> Send Reply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}