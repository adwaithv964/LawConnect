import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/main-dashboard',
      icon: 'LayoutDashboard'
    },
    {
      label: 'My Cases',
      path: '/legal-timeline-tracker',
      icon: 'FolderOpen'
    },
    {
      label: 'Legal Assistant',
      path: '/legal-steps-generator',
      icon: 'Scale'
    },
    {
      label: 'Legal Library',
      path: '/legal-library',
      icon: 'BookOpen'
    },
    {
      label: 'Documents',
      path: '/document-vault',
      icon: 'Lock'
    },
    {
      label: 'Document Templates',
      path: '/document-templates',
      icon: 'FileText'
    },
    {
      label: 'Emergency Support',
      path: '/victim-support-flow',
      icon: 'AlertCircle'
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: 'Settings'
    }
  ];

  const isActive = (path) => location?.pathname === path;

  return (
    <header className="sticky top-0 z-100 bg-card shadow-elevation-2 transition-smooth">
      <div className="mx-4 lg:mx-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link
            to="/main-dashboard"
            className="flex items-center gap-3 transition-smooth hover:opacity-80"
          >
            <div className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-primary rounded-lg">
              <Icon name="Scale" size={24} color="var(--color-primary-foreground)" />
            </div>
            <span className="text-xl lg:text-2xl font-heading font-semibold text-foreground">
              LawConnect
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-2">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg
                  transition-smooth font-medium text-sm
                  ${isActive(item?.path)
                    ? 'bg-primary text-primary-foreground shadow-elevation-1'
                    : 'text-foreground hover:bg-muted'
                  }
                  ${item?.path === '/victim-support-flow' ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}
                `}
              >
                <Icon
                  name={item?.icon}
                  size={18}
                  color={isActive(item?.path) || item?.path === '/victim-support-flow' ? 'currentColor' : 'var(--color-foreground)'}
                />
                <span>{item?.label}</span>
              </Link>
            ))}
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-smooth"
            aria-label="Toggle mobile menu"
          >
            <Icon
              name={mobileMenuOpen ? 'X' : 'Menu'}
              size={24}
              color="var(--color-foreground)"
            />
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border">
          <nav className="px-4 py-4 space-y-2">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-smooth font-medium
                  ${isActive(item?.path)
                    ? 'bg-primary text-primary-foreground shadow-elevation-1'
                    : 'text-foreground hover:bg-muted'
                  }
                  ${item?.path === '/victim-support-flow' ? 'bg-accent text-accent-foreground' : ''}
                `}
              >
                <Icon
                  name={item?.icon}
                  size={20}
                  color={isActive(item?.path) || item?.path === '/victim-support-flow' ? 'currentColor' : 'var(--color-foreground)'}
                />
                <span>{item?.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;