"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef, useEffect } from "react";
import { Camera, Upload } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/spinner";

export function ProfileModal({ open, onOpenChange, user }) {
  const { updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "/avatar-1.png");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const avatars = ["/avatar-1.png", "/avatar-2.png", "/avatar-3.png"];

  useEffect(() => {
    if (open && user) {
      setName(user.name || "");
      setSelectedAvatar(user.avatar || "/avatar-1.png");
    }
  }, [open, user]);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "libzone/avatars");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setSelectedAvatar(data.url);
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/users/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), avatar: selectedAvatar }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      updateUser(data.user);
      toast.success("Profile updated");
      onOpenChange(false);
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Make changes to your profile here. Choose a preset or upload your own.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer" onClick={handleUploadClick}>
              <Avatar className="h-24 w-24 border-4 border-slate-100 shadow-lg">
                {uploading ? (
                  <div className="flex h-full w-full items-center justify-center bg-slate-100">
                    <Spinner className="h-8 w-8" />
                  </div>
                ) : (
                  <>
                    <AvatarImage src={selectedAvatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">{initials}</AvatarFallback>
                  </>
                )}
              </Avatar>
              {!uploading && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white h-6 w-6" />
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
            <div className="flex flex-col items-center gap-3">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Presets</span>
              <div className="flex gap-2">
                {avatars.map((av, i) => (
                  <div
                    key={i}
                    className={`h-10 w-10 rounded-full overflow-hidden border-2 cursor-pointer transition-all shrink-0 ${selectedAvatar === av ? "border-primary ring-2 ring-primary/20" : "border-transparent"}`}
                    onClick={() => setSelectedAvatar(av)}
                  >
                    <img src={av} alt={`Avatar ${i + 1}`} className="h-full w-full object-cover" />
                  </div>
                ))}
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full shrink-0" onClick={handleUploadClick} disabled={uploading}>
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="profile-name">Display Name</Label>
            <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading}>{loading ? <Spinner className="h-4 w-4" /> : "Save changes"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
