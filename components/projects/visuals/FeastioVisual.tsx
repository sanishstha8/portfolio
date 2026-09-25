"use client";

import { useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { MockupFrame } from "./MockupFrame";

const TABS = ["DASHBOARD", "ORDERS", "TABLES", "BILLING"] as const;
type Tab = (typeof TABS)[number];

const MODULES = [
  { label: "ORDERS", detail: "LIFECYCLE" },
  { label: "TABLES", detail: "AVAILABILITY" },
  { label: "BILLING", detail: "SETTLEMENT" },
  { label: "MENU", detail: "CATALOGUE" },
];

const ORDERS = [
  { id: "ORD-0148", table: "TABLE 07", state: "PREPARING", tone: "active" },
  { id: "ORD-0147", table: "TABLE 02", state: "SERVED", tone: "done" },
  { id: "ORD-0146", table: "TAKEAWAY", state: "PLACED", tone: "idle" },
  { id: "ORD-0145", table: "TABLE 11", state: "SERVED", tone: "done" },
] as const;

const TABLES = [
  "free", "occupied", "free", "reserved",
  "occupied", "free", "free", "occupied",
  "reserved", "free", "occupied", "free",
] as const;

const BILL_LINES = [
  { item: "STEAM MOMO", qty: "2" },
  { item: "THUKPA", qty: "1" },
  { item: "CHIYA", qty: "3" },
];

type FeastioVisualProps = {
  className?: string;
  /** When false the mockup renders a single fixed panel with no controls. */
  interactive?: boolean;
};

/**
 * Drawn representation of the Feastio operator interface. On the case-study
 * page the four modules are switchable; on the index it renders as a static
 * panel so the whole card stays a single link target.
 */
export function FeastioVisual({ className, interactive = false }: FeastioVisualProps) {
  const [tab, setTab] = useState<Tab>("DASHBOARD");
  const baseId = useId();
  const tablistRef = useRef<HTMLDivElement>(null);

  /* Arrow-key navigation, per the ARIA tabs pattern. */
  const handleTablistKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const offset =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : event.key === "Home"
            ? -TABS.indexOf(tab)
            : event.key === "End"
              ? TABS.length - 1 - TABS.indexOf(tab)
              : 0;

    if (offset === 0 && event.key !== "Home" && event.key !== "End") return;

    event.preventDefault();
    const nextTab = TABS[(TABS.indexOf(tab) + offset + TABS.length) % TABS.length];
    setTab(nextTab);
    tablistRef.current
      ?.querySelector<HTMLButtonElement>(`#${CSS.escape(`${baseId}-tab-${nextTab}`)}`)
      ?.focus();
  };

  return (
    <MockupFrame context="FEASTIO" path={`APP / ${tab}`} className={className}>
      {/* Module switcher */}
      <div
        ref={tablistRef}
        role={interactive ? "tablist" : undefined}
        aria-label={interactive ? "Feastio interface modules" : undefined}
        onKeyDown={interactive ? handleTablistKeyDown : undefined}
        className="flex border-b border-line bg-shade/30"
      >
        {TABS.map((item) => {
          const selected = item === tab;
          const shared = `mono-micro relative flex-1 px-2 py-3 text-center transition-colors duration-300 ${
            selected ? "text-ink" : "text-faint"
          }`;

          const marker = (
            <>
              {item}
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 bottom-0 h-px origin-center bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  selected ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </>
          );

          if (!interactive) {
            return (
              <span key={item} aria-hidden="true" className={shared}>
                {marker}
              </span>
            );
          }

          return (
            <button
              key={item}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(item)}
              className={`${shared} hover:text-ink`}
            >
              {marker}
            </button>
          );
        })}
      </div>

      <div
        role={interactive ? "tabpanel" : undefined}
        id={interactive ? `${baseId}-panel-${tab}` : undefined}
        aria-labelledby={interactive ? `${baseId}-tab-${tab}` : undefined}
        tabIndex={interactive ? 0 : undefined}
        className="min-h-[15rem] p-4 @lg:min-h-[17rem] @lg:p-5"
      >
        {tab === "DASHBOARD" ? <DashboardPanel /> : null}
        {tab === "ORDERS" ? <OrdersPanel /> : null}
        {tab === "TABLES" ? <TablesPanel /> : null}
        {tab === "BILLING" ? <BillingPanel /> : null}
      </div>
    </MockupFrame>
  );
}

function DashboardPanel() {
  return (
    <div>
      <div className="grid grid-cols-2 border-l border-t border-line @2xl:grid-cols-4">
        {MODULES.map((module) => (
          <div
            key={module.label}
            className="border-b border-r border-line px-3.5 py-4 transition-colors duration-300 hover:bg-black/[0.025]"
          >
            <p className="mono-micro text-faint">{module.detail}</p>
            <p className="mt-2 font-mono text-[0.875rem] tracking-tight text-ink">
              {module.label}
            </p>
            <span aria-hidden="true" className="mt-3 flex gap-[3px]">
              {Array.from({ length: 12 }).map((_, index) => (
                <span
                  key={index}
                  className={`h-2.5 flex-1 ${index % 4 === 0 ? "bg-accent/60" : "bg-black/8"}`}
                />
              ))}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted">
        Service overview: every module talks to one REST API.
      </p>
    </div>
  );
}

function OrdersPanel() {
  return (
    <ul className="border-t border-line-soft">
      {ORDERS.map((order) => (
        <li
          key={order.id}
          className="flex items-center justify-between gap-3 border-b border-line-soft py-3"
        >
          <span className="mono-micro shrink-0 text-muted">{order.id}</span>
          <span className="mono-micro truncate text-faint">{order.table}</span>
          <span
            className={`mono-micro shrink-0 border px-2 py-1 ${
              order.tone === "active"
                ? "border-accent/40 text-accent"
                : order.tone === "done"
                  ? "border-line text-faint"
                  : "border-line text-muted"
            }`}
          >
            {order.state}
          </span>
        </li>
      ))}
    </ul>
  );
}

function TablesPanel() {
  return (
    <div>
      <div className="grid grid-cols-4 gap-2 @2xl:grid-cols-6">
        {TABLES.map((state, index) => (
          <div
            key={index}
            className={`flex aspect-[4/3] flex-col items-center justify-center gap-1 border ${
              state === "occupied"
                ? "border-accent/45 bg-accent/8"
                : state === "reserved"
                  ? "border-dashed border-line-strong"
                  : "border-line"
            }`}
          >
            <span className="mono-micro text-muted">
              T{String(index + 1).padStart(2, "0")}
            </span>
            <span
              className={`mono-micro ${
                state === "occupied" ? "text-accent" : "text-faint"
              }`}
            >
              {state === "occupied" ? "SEATED" : state === "reserved" ? "HELD" : "FREE"}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted">
        Floor state: a booking holds a table for a time window.
      </p>
    </div>
  );
}

function BillingPanel() {
  return (
    <div className="mx-auto max-w-sm border border-line bg-shade/40 p-4">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <span className="mono-micro text-muted">BILL / ORD-0147</span>
        <span className="mono-micro text-faint">TABLE 02</span>
      </div>

      <ul className="py-2">
        {BILL_LINES.map((line) => (
          <li key={line.item} className="flex items-center gap-3 py-2">
            <span className="mono-micro text-faint">×{line.qty}</span>
            <span className="mono-micro flex-1 truncate text-muted">{line.item}</span>
            <span aria-hidden="true" className="h-1.5 w-10 bg-black/10" />
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t border-line pt-3">
        <span className="mono-micro text-ink">TOTAL</span>
        <span aria-hidden="true" className="h-1.5 w-16 bg-accent/70" />
      </div>
      <p className="mt-3 text-sm text-muted">
        Totals are worked out from the order lines.
      </p>
    </div>
  );
}
