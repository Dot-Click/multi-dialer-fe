import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useDeleteSession, useSessions } from "@/hooks/useTracker";
import { formatMoney } from "@/utils/prospectingFormat";

export function ActivityLogTab() {
  const { data: sessions, isLoading } = useSessions();
  const deleteSession = useDeleteSession();

  const handleDelete = async (id: string) => {
    try {
      await deleteSession.mutateAsync(id);
      toast.success("Entry deleted");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Could not delete entry");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity log</CardTitle>
        <CardDescription>
          Manual entries only — what you logged by hand, on top of the dialer and
          CRM figures. One row per day and channel; deleting a row removes only
          what was logged here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : !sessions || sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No manual entries yet. Hours, contacts and funnel stages are being derived automatically from the dialer and CRM.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Hours</TableHead>
                <TableHead className="text-right">Contacts</TableHead>
                <TableHead className="text-right">Leads</TableHead>
                <TableHead className="text-right">Set</TableHead>
                <TableHead className="text-right">Met</TableHead>
                <TableHead className="text-right">Taken</TableHead>
                <TableHead className="text-right">U/C</TableHead>
                <TableHead className="text-right">Closed</TableHead>
                <TableHead className="text-right">GCI</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((row) => (
                <TableRow key={row.id}>
                  {/* No "edited" badge: isOverride defaults to true and was set on
                      every row, so it marked nothing. These rows add to the day
                      rather than editing it, which is the other reason it went. */}
                  <TableCell className="whitespace-nowrap">{row.loggedOn.slice(0, 10)}</TableCell>
                  <TableCell>{row.source ?? "—"}</TableCell>
                  <TableCell className="text-right">{Number(row.hours).toFixed(1)}</TableCell>
                  <TableCell className="text-right">{row.contacts}</TableCell>
                  <TableCell className="text-right">{row.leads}</TableCell>
                  <TableCell className="text-right">{row.apptsSet}</TableCell>
                  <TableCell className="text-right">{row.apptsMet}</TableCell>
                  <TableCell className="text-right">{row.listingsTaken}</TableCell>
                  <TableCell className="text-right">{row.underContract}</TableCell>
                  <TableCell className="text-right">{row.closed}</TableCell>
                  <TableCell className="text-right">{formatMoney(Number(row.gci))}</TableCell>
                  <TableCell className="max-w-[160px] truncate text-muted-foreground">{row.notes ?? ""}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)} disabled={deleteSession.isPending}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
