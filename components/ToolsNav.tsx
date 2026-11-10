'use client';

import { ChevronRight } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

type ToolLink = {
  label: string;
  href: string;
};

type ToolItem =
  | { id: string; label: string; href: string; internal?: boolean }
  | { id: string; label: string; children: ToolLink[] };

const tools: ToolItem[] = [
  {
    id: 'freddie-ami',
    label: 'Freddie AMI & Property Eligibility Tool',
    href: 'https://sf.freddiemac.com/working-with-us/affordable-lending/area-median-income-and-property-eligibility-tool',
  },
  {
    id: 'counseling',
    label: 'Homeownership Counseling Course',
    children: [
      {
        label: 'Freddie Mac CreditSmart Homebuyer U Course',
        href: 'https://creditsmart.freddiemac.com/paths/homebuyer-u',
      },
      {
        label: 'Fannie Mae HomeView Course',
        href: 'https://www.fanniemae.com/education',
      },
    ],
  },
  {
    id: 'pricing',
    label: 'Pricing Tool',
    href: 'https://www2.optimalblue.com/',
  },
  {
    id: 'lo-resources',
    label: 'LO Resources',
    href: '/tools/lo-resources',
    internal: true,
  },
  {
    id: 'processing-resources',
    label: 'Processing Resources',
    href: '/tools/processing-resources',
    internal: true,
  },
  {
    id: 'atlas',
    label: 'QuestRock AI (Atlas)',
    href: 'https://app.addy.so',
  },
];

const linkClass =
  'flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-[13px] font-medium leading-snug text-text-dark no-underline transition-colors hover:bg-green-pale hover:text-green';

export function ToolsNav({ showQuestRockAI = false }: { showQuestRockAI?: boolean }) {
  const menuId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [submenu, setSubmenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function scheduleClose() {
    clearClose();
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setSubmenu(null);
    }, 120);
  }

  function openMenu() {
    clearClose();
    setOpen(true);
  }

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setSubmenu(null);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        setSubmenu(null);
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
      clearClose();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative z-[60]"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className="relative z-[60] inline-flex min-h-11 items-center whitespace-nowrap text-xs font-normal text-white/55 transition-colors hover:text-white sm:text-sm"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => {
          clearClose();
          setOpen((current) => !current);
          if (open) setSubmenu(null);
        }}
      >
        Tools
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Tools"
          className="absolute right-0 top-full z-[70] min-w-[280px] pt-2"
        >
          <div className="rounded-[12px] border border-[var(--border-card)] bg-white py-1.5 shadow-[0_12px_32px_rgba(26,60,46,0.16)]">
            {tools
              .filter((tool) => tool.id !== 'atlas' || showQuestRockAI)
              .map((tool) => {
              if ('href' in tool) {
                const internal = Boolean(tool.internal);
                return (
                  <a
                    key={tool.id}
                    role="menuitem"
                    href={tool.href}
                    target={internal ? undefined : '_blank'}
                    rel={internal ? undefined : 'noopener noreferrer'}
                    className={linkClass}
                    onMouseEnter={() => setSubmenu(null)}
                  >
                    {tool.label}
                  </a>
                );
              }

              const childOpen = submenu === tool.id;
              return (
                <div
                  key={tool.id}
                  className="relative"
                  onMouseEnter={() => setSubmenu(tool.id)}
                >
                  <button
                    type="button"
                    role="menuitem"
                    aria-haspopup="menu"
                    aria-expanded={childOpen}
                    className={linkClass}
                    onClick={() => setSubmenu(childOpen ? null : tool.id)}
                  >
                    <span>{tool.label}</span>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-text-muted" strokeWidth={2} aria-hidden />
                  </button>
                  {childOpen ? (
                    <div
                      role="menu"
                      className="absolute left-0 top-full z-50 mt-1 min-w-[260px] sm:left-auto sm:right-full sm:top-0 sm:mt-0 sm:pr-1"
                    >
                      <div className="rounded-[12px] border border-[var(--border-card)] bg-white py-1.5 shadow-[0_12px_32px_rgba(26,60,46,0.16)]">
                        {tool.children.map((child) => (
                          <a
                            key={child.href}
                            role="menuitem"
                            href={child.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={linkClass}
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
