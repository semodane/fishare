"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/auth.d";

const ROLES: { value: UserRole; label: string }[] = [
  { value: "OWNER", label: "소유자" },
  { value: "ADMIN", label: "관리자" },
  { value: "USER",  label: "일반" }
];

export function UserRoleSelect({
  userId,
  currentRole,
  myRole
}: {
  userId: string;
  currentRole: UserRole;
  myRole: UserRole;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleChange(newRole: UserRole) {
    if (newRole === currentRole) return;
    if (!confirm(`역할을 "${ROLES.find(r => r.value === newRole)?.label}"(으)로 변경할까요?`)) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role: newRole })
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <select
      value={currentRole}
      disabled={busy}
      onChange={(e) => void handleChange(e.target.value as UserRole)}
      className="rounded-lg border border-black/10 bg-white px-2 py-1 text-xs font-medium text-neutral-700 disabled:opacity-50"
    >
      {ROLES.filter(r => myRole === "OWNER" || r.value !== "OWNER").map(r => (
        <option key={r.value} value={r.value}>{r.label}</option>
      ))}
    </select>
  );
}
