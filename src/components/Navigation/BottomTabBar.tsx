import React from 'react';
import { Home, Compass, Plus, Bell, User } from 'lucide-react';

export type MainTab = 'feed' | 'discover' | 'notifications' | 'profile';

interface BottomTabBarProps {
  currentTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  onOpenCreate: () => void;
  unreadCount?: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentTab,
  onSelectTab,
  onOpenCreate,
  unreadCount = 2,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/90 backdrop-blur-md border-t border-neutral-800/80 px-2 py-1 max-w-lg mx-auto sm:rounded-t-2xl">
      <div className="flex items-center justify-around h-14">
        {/* Home Feed */}
        <button
          onClick={() => onSelectTab('feed')}
          className={`flex flex-col items-center justify-center w-14 h-full transition-colors ${
            currentTab === 'feed' ? 'text-amber-400' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Home</span>
        </button>

        {/* Discover */}
        <button
          onClick={() => onSelectTab('discover')}
          className={`flex flex-col items-center justify-center w-14 h-full transition-colors ${
            currentTab === 'discover' ? 'text-amber-400' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Discover</span>
        </button>

        {/* Central Create Button (+) */}
        <button
          onClick={onOpenCreate}
          className="relative -top-2 flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-neutral-950 font-black shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-transform"
          title="Create & Edit Comedy Video"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Notifications / Laugh Alerts */}
        <button
          onClick={() => onSelectTab('notifications')}
          className={`relative flex flex-col items-center justify-center w-14 h-full transition-colors ${
            currentTab === 'notifications' ? 'text-amber-400' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-3 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center">
              {unreadCount}
            </span>
          )}
          <span className="text-[10px] font-semibold mt-1">Alerts</span>
        </button>

        {/* User Profile */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center justify-center w-14 h-full transition-colors ${
            currentTab === 'profile' ? 'text-amber-400' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
};
