import { Fragment } from 'react';
import { Search, Plus } from 'lucide-react';

export default function TopBar({ crumbs = [], onAdd, rightSlot }) {
  return (
    <div className="topbar">
      <div className="topbar-crumb" aria-label="Breadcrumb">
        {crumbs.map((c, i) => (
          <Fragment key={i}>
            {i > 0 && <span className="sep" aria-hidden="true">/</span>}
            <span style={{ color: i === crumbs.length - 1 ? 'var(--ink)' : undefined }}>{c}</span>
          </Fragment>
        ))}
      </div>

      <div className="topbar-search" role="search">
        <Search size={14} strokeWidth={1.6} aria-hidden="true" />
        <input
          placeholder="Search applications, notes, contacts…"
          aria-label="Search"
        />
        <span className="kbd" aria-hidden="true">⌘K</span>
      </div>

      {rightSlot}

      <button className="btn btn-dark btn-sm" onClick={onAdd} aria-label="Add application">
        <Plus size={14} strokeWidth={2} />
        Add application
      </button>
    </div>
  );
}
