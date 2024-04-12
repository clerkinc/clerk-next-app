'use client';

import { useOrganization, useSession, useUser } from '@clerk/nextjs';

function classNames(...classes: (string | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

function Row({ desc, value, children }: { desc: string; value: string; children: React.ReactNode }) {
  return (
    <div className="h-[34px] grid grid-cols-2 items-center relative">
      <span className="text-xs font-semibold block flex-shrink-0">{desc}</span>
      <span className="text-xs text-[#7D7D7E] font-mono block relative">
        <span className="block truncate w-full">{value}</span>
        {children}
      </span>
    </div>
  );
}

function PointerC({ label, width, className }: { label: string; width: number; className: string }) {
  return (
    <div
      className={classNames('absolute w-fit flex items-center gap-5 top-1/2 -translate-y-1/2 left-full')}
    >
      <div className="relative">
        <div style={{ width: 104 }} className="h-px bg-[#BFBFC4]" />
        <div className="size-1 bg-[#BFBFC4] rotate-45 absolute right-0 top-1/2 -translate-y-1/2" />
      </div>
      <div className="font-mono text-xs bg-black px-1.5 py-1 rounded-md text-white">{label}</div>
    </div>
  );
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateWithNumbers(date: Date): string {
  return date.toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

export function UserDetails() {
  const { user } = useUser();
  const { session } = useSession();
  const { organization } = useOrganization();

  if (!user || !session) return null;

  return (
    <div className="p-16 rounded-lg border border-[#EDEDED] bg-[#F1F1F2] background relative">
      <div className="p-8 rounded-xl bg-white shadow-[0_5px_15px_rgba(0,0,0,0.08),0_15px_35px_-5px_rgba(25,28,33,0.2)] ring-1 ring-gray-950/5 max-w-[400px]">
        <div className="flex flex-col items-center gap-2 mb-6">
          <img src={user.imageUrl} className="size-20 rounded-full" />
          <h1 className="text-[17px] font-semibold">
            {user.firstName} {user.lastName}
          </h1>
        </div>

        <div className="px-2.5 bg-[#FAFAFB] rounded-lg divide-y divide-[#EEEEF0]">
          <Row desc="Email" value={user.emailAddresses[0].emailAddress}>
            <PointerC label="user.emailAddresses[0].emailAddress" />
          </Row>
          <Row desc="Last signed in" value={formatDate(user.lastSignInAt!)}>
            <PointerC label="user.lastSignInAt" />
          </Row>
          <Row desc="Joined on" value={formatDate(user.createdAt!)} />
          <Row desc="User ID" value={user.id} />
        </div>
        <h2 className="mt-6 mb-4 text-[15px] font-semibold">Session details</h2>
        <div className="px-2.5 bg-[#FAFAFB] rounded-lg divide-y divide-[#EEEEF0]">
          <Row desc="Session ID" value={session.id} />
          <Row desc="Status" value={session.status} />
          <Row desc="Last active" value={formatDateWithNumbers(session.lastActiveAt)} />
          <Row desc="Session expiration" value={formatDateWithNumbers(session.expireAt)} />
        </div>
        {organization ? (
          <>
            <h2 className="mt-6 mb-4 text-[15px] font-semibold">Organisation detail</h2>
            <div className="px-2.5 bg-[#FAFAFB] rounded-lg divide-y divide-[#EEEEF0]">
              <Row desc="Organisation ID" value={organization.id} />
              <Row desc="Name" value={organization.name} />
              <Row desc="Members" value={String(organization.membersCount)} />
              <Row desc="Pending invitations" value={String(organization.pendingInvitationsCount)} />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
