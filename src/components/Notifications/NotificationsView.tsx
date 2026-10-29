import React from 'react';
import { Heart, MessageCircle, Share2, Sparkles, UserPlus } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const alerts = [
    {
      id: 'n-1',
      type: 'whatsapp',
      title: 'Viral Alert! 🔥',
      desc: 'Your video "When Dad finds your online shopping cart" was forwarded 1,400+ times on WhatsApp in the last hour!',
      time: '12m ago',
      icon: MessageCircle,
      iconColor: 'text-emerald-400 bg-emerald-500/20',
    },
    {
      id: 'n-2',
      type: 'clap',
      title: 'Taali Applause 👏',
      desc: 'Rohit Verma and 328 others clapped for your latest comedy skit.',
      time: '45m ago',
      icon: Sparkles,
      iconColor: 'text-amber-400 bg-amber-500/20',
    },
    {
      id: 'n-3',
      type: 'follow',
      title: 'New Laugh Follower',
      desc: 'Priya Sharma (Meme Rani) started following you.',
      time: '2h ago',
      icon: UserPlus,
      iconColor: 'text-rose-400 bg-rose-500/20',
    },
    {
      id: 'n-4',
      type: 'comment',
      title: 'New Punchline Comment',
      desc: 'Ananya: "Papa ka flying chappal loading in 3... 2... 1 😂"',
      time: '3h ago',
      icon: MessageCircle,
      iconColor: 'text-sky-400 bg-sky-500/20',
    },
  ];

  return (
    <div className="w-full h-full bg-neutral-950 text-neutral-100 overflow-y-auto no-scrollbar p-5 pb-24 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
        <div>
          <h2 className="font-display font-bold text-lg text-white">Laugh Alerts & Activity</h2>
          <p className="text-xs text-neutral-400">Recent claps, comments, and viral WhatsApp shares</p>
        </div>
        <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
          All Caught Up
        </span>
      </div>

      <div className="space-y-2.5">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <div
              key={alert.id}
              className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-start gap-3.5 hover:border-neutral-700 transition-colors"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${alert.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-white">{alert.title}</h4>
                  <span className="text-[10px] text-neutral-500">{alert.time}</span>
                </div>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">{alert.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
