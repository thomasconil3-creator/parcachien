"use client";

import { useStore } from "@/lib/store";
import { ThumbsUp, Clock } from "lucide-react";

interface Props {
  onParkSelect?: (parkId: string) => void;
}

export default function StoriesBanner({ onParkSelect }: Props) {
  const { getActiveStories, likeStory } = useStore();
  const stories = getActiveStories().slice(0, 10);

  if (stories.length === 0) return null;

  return (
    <div className="glass-dark border-b border-white/10 px-4 py-3 shadow-md relative z-20">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 pt-1">
        {stories.map((story) => {
          const hoursLeft = Math.max(0, Math.round((story.expiresAt - Date.now()) / 3600000));
          return (
            <div
              key={story.id}
              onClick={() => onParkSelect?.(story.parkId)}
              className="flex-shrink-0 w-48 glass rounded-3xl p-4 cursor-pointer card-hover border border-white/20 shadow-lg relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="text-2xl drop-shadow-sm transform group-hover:scale-110 transition-transform">{story.emoji}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-50 bg-amber-500/80 border border-amber-400/50 px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Clock size={10} /> {hoursLeft}h
                </span>
              </div>
              <p className="text-sm font-bold text-gray-900 truncate relative z-10">{story.dogName}</p>
              <p className="text-[10px] font-bold text-amber-700 truncate uppercase tracking-wider mb-1 relative z-10">{story.parkName}</p>
              <p className="text-xs font-medium text-gray-700 mt-2 line-clamp-2 leading-relaxed relative z-10">{story.text}</p>
              
              <button
                onClick={(e) => { e.stopPropagation(); likeStory(story.id); }}
                className="mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-pink-500 hover:text-pink-600 transition-colors relative z-10 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100"
              >
                <ThumbsUp size={12} className="transform group-hover:scale-110 transition-transform" /> {story.likes} j'aime
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
