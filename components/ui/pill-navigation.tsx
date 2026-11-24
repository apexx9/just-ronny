'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { motionTransitions } from '../../lib/motion-tokens';

export interface PillSubItem { id: string; label: string; badge?: string; }
export interface PillNavigationItem { id: string; label: string; children?: PillSubItem[]; }
export interface PillNavigationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items?: PillNavigationItem[];
  defaultValue?: string;
  defaultSubValue?: string;
  onChange?: (id: string, subId?: string) => void;
}

const defaultItems: PillNavigationItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'motion', label: 'Motion', children: [{ id: 'springs', label: 'Spring Physics' }, { id: 'caustics', label: 'Liquid Caustics' }, { id: 'gestures', label: 'Gesture Drag' }] },
  { id: 'access', label: 'Access' },
  { id: 'code', label: 'Code', children: [{ id: 'react', label: 'React JSX' }, { id: 'tailwind', label: 'Tailwind v3' }] },
];

export const PillNavigation: React.FC<PillNavigationProps> = ({
  items = defaultItems, defaultValue, defaultSubValue, onChange, className
}) => {
  const [activeId, setActiveId] = useState(defaultValue || items[0]?.id);
  const [activeSubId, setActiveSubId] = useState<string | undefined>(defaultSubValue);
  const [submenuOpen, setSubmenuOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const activeItem = items.find((item) => item.id === activeId) || items[0];
  const hasSubmenu = Boolean(activeItem?.children?.length);

  const selectMain = (id: string) => {
    const item = items.find((entry) => entry.id === id);
    if (id === activeId && item?.children) { setSubmenuOpen((prev) => !prev); return; }
    setActiveId(id);
    setSubmenuOpen(true);
    const firstChild = item?.children?.[0]?.id;
    setActiveSubId(firstChild);
    onChange?.(id, firstChild);
  };
  const selectSub = (subId: string) => { setActiveSubId(subId); onChange?.(activeId, subId); };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = items.findIndex((item) => item.id === activeId);
    if (currentIndex === -1) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const offset = event.key === 'ArrowRight' ? 1 : -1;
      selectMain(items[(currentIndex + offset + items.length) % items.length].id);
    } else if (event.key === 'ArrowDown' && hasSubmenu && activeItem?.children) {
      event.preventDefault();
      const index = activeItem.children.findIndex((item) => item.id === activeSubId);
      selectSub(activeItem.children[(index + 1) % activeItem.children.length].id);
    } else if (event.key === 'ArrowUp' && hasSubmenu && activeItem?.children) {
      event.preventDefault();
      const index = activeItem.children.findIndex((item) => item.id === activeSubId);
      selectSub(activeItem.children[(index - 1 + activeItem.children.length) % activeItem.children.length].id);
    } else if (event.key === 'Escape') setSubmenuOpen(false);
  };

  return (
    <motion.div ref={containerRef} layout={!reducedMotion} transition={motionTransitions.springGentle}
      className={['inline-flex flex-col items-center gap-2 select-none', className].filter(Boolean).join(' ')}
      role="navigation" aria-label="Pill navigation" onKeyDown={handleKeyDown} tabIndex={0}>
      <div role="tablist" aria-label="Portfolio sections" className="inline-flex items-center rounded-full border border-[#1F1F1F] bg-[#050505] p-1 shadow-inner">
        {items.map((item) => {
          const active = item.id === activeId;
          const itemHasChildren = Boolean(item.children?.length);
          return <motion.button key={item.id} type="button" role="tab" aria-selected={active}
            aria-expanded={active && itemHasChildren ? submenuOpen : undefined} tabIndex={active ? 0 : -1}
            whileTap={reducedMotion ? undefined : { scale: 0.96 }} onClick={() => selectMain(item.id)}
            className={['focus-ring relative flex min-h-8 items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-colors cursor-pointer', active ? 'text-[#050505] font-semibold' : 'text-[#A1A1A1] hover:text-[#FAFAFA]'].join(' ')}>
            {active && !reducedMotion && <motion.span layoutId="easyui-pill-main-indicator" transition={motionTransitions.springMorph} className="absolute inset-0 rounded-full bg-[#FAFAFA] shadow-[0_2px_8px_rgba(0,0,0,0.35)]" />}
            {active && reducedMotion && <span className="absolute inset-0 rounded-full bg-[#FAFAFA]" />}
            <span className="relative z-10">{item.label}</span>
            {itemHasChildren && <ChevronDown className={['relative z-10 h-3 w-3 transition-transform duration-200', active ? 'text-[#050505]' : 'text-[#6B6B6B]', active && submenuOpen ? 'rotate-180' : ''].join(' ')} />}
          </motion.button>;
        })}
      </div>
      <AnimatePresence mode="wait">
        {hasSubmenu && submenuOpen && activeItem && <motion.div key={activeItem.id} layout={!reducedMotion}
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.96 }}
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.96 }}
          transition={motionTransitions.springGentle} role="menu" aria-label={`${activeItem.label} submenu`}
          className="inline-flex items-center gap-1 rounded-full border border-[#171717] bg-[#0B0B0B]/90 p-1 shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
          {activeItem.children?.map((item) => <motion.button key={item.id} type="button" role="menuitemradio"
            aria-checked={item.id === activeSubId} whileTap={reducedMotion ? undefined : { scale: 0.95 }}
            onClick={() => selectSub(item.id)} className="relative flex min-h-7 items-center rounded-full px-3 py-1 text-[11px] font-medium text-[#A1A1A1]">
            <span className="relative z-10">{item.label}</span>
          </motion.button>)}
        </motion.div>}
      </AnimatePresence>
    </motion.div>
  );
};

export default PillNavigation;
