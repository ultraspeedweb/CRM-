import { Search } from "lucide-react";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return <header className="page-header"><div><p className="kicker">SatışDesk</p><h1>{title}</h1><p>{subtitle}</p></div><div className="header-tools"><label className="search-box"><Search size={17} /><input aria-label="بحث" placeholder="بحث سريع..." /></label>{action}</div></header>;
}
