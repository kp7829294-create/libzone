"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export function PasswordModal({ open, onOpenChange }) {
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwords.new.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/users/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      toast.success("Password updated");
      setPasswords({ current: "", new: "", confirm: "" });
      onOpenChange(false);
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) setPasswords({ current: "", new: "", confirm: "" }); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-[425px] max-w-[calc(100vw-32px)] rounded-2xl p-6 sm:p-6">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>Ensure your account is secure by using a strong password.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="current">Current Password</Label>
            <PasswordInput id="current" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} disabled={loading} placeholder="••••••••" className="h-11 sm:h-12 rounded-xl" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new">New Password</Label>
            <PasswordInput id="new" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} disabled={loading} placeholder="••••••••" minLength={6} className="h-11 sm:h-12 rounded-xl" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm">Confirm New Password</Label>
            <PasswordInput id="confirm" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} disabled={loading} placeholder="••••••••" className="h-11 sm:h-12 rounded-xl" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading}>{loading ? <Spinner className="h-4 w-4" /> : "Update Password"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
