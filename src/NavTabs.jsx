const TABS = [
  { key: "designer", label: "Designer", href: "/" },
  { key: "gallery", label: "Gallery", href: "/?gallery" },
  { key: "display", label: "Live display", href: "/?display" },
];

export default function NavTabs({ current }) {
  return (
    <div className="nav-tabs">
      {TABS.map((tab) => (
        <a
          key={tab.key}
          href={tab.href}
          className={`gallery-nav-btn${tab.key === current ? " gallery-nav-btn--active" : ""}`}
          aria-current={tab.key === current ? "page" : undefined}
        >
          {tab.label}
        </a>
      ))}
    </div>
  );
}
