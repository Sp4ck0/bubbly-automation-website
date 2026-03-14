import { useState } from "react";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "@convex/api";
import type { Id } from "@convex/dataModel";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import BlockIcon from "@mui/icons-material/Block";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

type Token = NonNullable<ReturnType<typeof useQuery<typeof api.tokens.listTokens>>>[number];

export default function TokensPage() {
  const tokens = useQuery(api.tokens.listTokens);
  const createToken = useAction(api.tokens.createToken);
  const revokeToken = useMutation(api.tokens.revokeToken);
  const deleteToken = useMutation(api.tokens.deleteToken);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [creating, setCreating] = useState(false);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      const result = await createToken({
        name: name.trim(),
        expiresAt: expiresAt ? new Date(expiresAt).getTime() : undefined,
      });
      setNewToken(result.rawToken);
      setName("");
      setExpiresAt("");
      setOpen(false);
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = () => {
    if (newToken) {
      navigator.clipboard.writeText(newToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRevoke = async (tokenId: Id<"tokens">) => {
    await revokeToken({ tokenId });
  };

  const handleDelete = async (tokenId: Id<"tokens">) => {
    await deleteToken({ tokenId });
  };

  const isActive = (t: { revokedAt?: number | null; expiresAt?: number | null }) =>
    !t.revokedAt && (!t.expiresAt || t.expiresAt > Date.now());

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>
          API Tokens
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          disableElevation
        >
          Create Token
        </Button>
      </Box>

      {newToken && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => setNewToken(null)}
          action={
            <Button
              size="small"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopy}
              color="inherit"
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
          }
        >
          <Typography variant="body2" fontWeight={600} mb={1}>
            Copy this token now — it will not be shown again.
          </Typography>
          <Typography
            variant="body2"
            fontFamily="monospace"
            sx={{ wordBreak: "break-all", bgcolor: "rgba(0,0,0,0.06)", p: 1, borderRadius: 1 }}
          >
            {newToken}
          </Typography>
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: 0 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Prefix</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Expires</TableCell>
                <TableCell>Last Used</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tokens === undefined ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    Loading…
                  </TableCell>
                </TableRow>
              ) : tokens.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No tokens yet. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                tokens.map((token: Token) => (
                  <TableRow key={token._id}>
                    <TableCell>{token.name}</TableCell>
                    <TableCell>
                      <Typography fontFamily="monospace" variant="body2">
                        {token.prefix}…
                      </Typography>
                    </TableCell>
                    <TableCell>{new Date(token.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {token.expiresAt
                        ? new Date(token.expiresAt).toLocaleDateString()
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      {token.lastUsedAt
                        ? new Date(token.lastUsedAt).toLocaleString()
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      {isActive(token) ? (
                        <Chip label="Active" color="success" size="small" />
                      ) : token.revokedAt ? (
                        <Chip label="Revoked" color="error" size="small" />
                      ) : (
                        <Chip label="Expired" color="default" size="small" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {isActive(token) && (
                        <Tooltip title="Revoke">
                          <IconButton
                            size="small"
                            onClick={() => handleRevoke(token._id as Id<"tokens">)}
                          >
                            <BlockIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(token._id as Id<"tokens">)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Create API Token</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          <TextField
            label="Name"
            placeholder="e.g. OpenClaw on Mac Mini"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            autoFocus
          />
          <TextField
            label="Expires (optional)"
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            helperText="Leave blank for no expiry"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!name.trim() || creating}
            disableElevation
          >
            {creating ? "Creating…" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
