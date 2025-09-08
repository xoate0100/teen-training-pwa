'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useResponsiveNavigation() {
  const [isMobile, setIsMobile] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const router = useRouter();

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Handle tab changes
  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);

    // Navigate to appropriate route
    switch (tabId) {
      case 'dashboard':
        router.push('/');
        break;
      case 'session':
        router.push('/session');
        break;
      case 'progress':
        router.push('/progress');
        break;
      case 'settings':
        router.push('/settings');
        break;
      case 'achievements':
        // Keep on same page but change tab
        break;
      case 'social':
        // Keep on same page but change tab
        break;
      case 'ai':
        // Keep on same page but change tab
        break;
      case 'wellness':
        // Keep on same page but change tab
        break;
      case 'smart':
        // Keep on same page but change tab
        break;
      case 'interactive':
        // Keep on same page but change tab
        break;
      default:
        break;
    }
  };

  return {
    isMobile,
    currentTab,
    handleTabChange,
  };
}
