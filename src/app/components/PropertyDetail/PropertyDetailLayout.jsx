/**
 * PropertyDetailLayout.jsx
 * Handles responsive 2-column layout (desktop) vs single-column (mobile/tablet)
 * Desktop: Content (70%) | Sidebar (30%)
 * Mobile/Tablet: Content (100%) with sidebar below
 */

export function PropertyDetailLayout({ children, sidebar }) {
  return (
    <div className="bg-bone-white dark:bg-charcoal-blue min-h-screen">
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content - 2/3 width on desktop, full width on mobile */}
          <div className="lg:col-span-2">{children}</div>

          {/* Sidebar - 1/3 width on desktop, full width on mobile */}
          <div className="lg:col-span-1">
            {/* On desktop: sticky sidebar */}
            <div className="hidden lg:block lg:sticky lg:top-20">{sidebar}</div>

            {/* On mobile/tablet: full width below content */}
            <div className="lg:hidden">{sidebar}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetailLayout;
