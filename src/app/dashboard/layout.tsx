'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import BottomNav from '@/components/ui/BottomNav';
import FAB from '@/components/ui/FAB';

// Nav icons as inline SVGs
const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const CameraIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const ChatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const InsightsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CameraFabIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 15.2c-1.2 0-2.2-1-2.2-2.2s1-2.2 2.2-2.2 2.2 1 2.2 2.2-1 2.2-2.2 2.2zM9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
  </svg>
);

const NAV_ITEMS = [
  { icon: <HomeIcon />, label: 'Home', path: '/dashboard' },
  { icon: <CameraIcon />, label: 'Camera', path: '/dashboard/camera' },
  { icon: <ChatIcon />, label: 'Chat', path: '/dashboard/chat' },
  { icon: <InsightsIcon />, label: 'Insights', path: '/dashboard/insights' },
  { icon: <ProfileIcon />, label: 'Profile', path: '/dashboard/profile' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--md-sys-color-surface)',
        paddingBottom: '96px', // space for bottom nav
      }}
    >
      {/* Page content */}
      {children}

      {/* FAB */}
      <div
        style={{
          position: 'fixed',
          bottom: '96px',
          right: '16px',
          zIndex: 40,
        }}
      >
        <FAB
          icon={<CameraFabIcon />}
          onClick={() => router.push('/dashboard/camera')}
          variant="primary"
          size="md"
        />
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        items={NAV_ITEMS}
        activePath={pathname}
        onNavigate={(path) => router.push(path)}
      />
    </div>
  );
}
