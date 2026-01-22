# Modal Design System Documentation

## Overview
The website uses a unified, luxury modal design pattern that maintains visual consistency across the entire application. All modals follow this established design to create a cohesive, premium user experience.

---

## Design Philosophy

**Theme**: Modern Luxury
**Primary Colors**: 
- Gold/Accent: `#d4af37`
- Dark: `#1a1f2e`
- Light/Background: `#faf8f5`
- Text Secondary: `#9baab8`, `#6b7280`
- Border: `#e0dbd3`

**Typography**: 
- Serif font for headings (elegant)
- Sans-serif for body (readable)
- Light font weights (luxurious feel)

---

## Modal Anatomy

### 1. **Backdrop**
```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  onClick={onClose}
  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
/>
```
- Subtle blur effect (`backdrop-blur-sm`)
- Dark overlay (`bg-black/40`)
- Clickable to close (dismiss behavior)
- Lower z-index (40) so modal sits above

### 2. **Container**
```jsx
<motion.div
  initial={{ opacity: 0, scale: 0.95, y: 20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.95, y: 20 }}
  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
  className="fixed inset-0 flex items-center justify-center z-50 px-4"
>
  <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
    {/* Modal Content */}
  </div>
</motion.div>
```

**Key Features**:
- Centered with flexbox (`inset-0 flex items-center justify-center`)
- Responsive width (`max-w-2xl`, `w-full`, `px-4`)
- High z-index (50) above backdrop
- Smooth scale and fade entrance animation
- Rounded corners (`rounded-3xl`)
- Strong shadow (`shadow-2xl`)

### 3. **Header Section**
```jsx
<div className="relative h-32 bg-gradient-to-r from-[#1a1f2e] via-[#2a3f5f] to-[#1a1f2e] px-8 py-6 flex items-center justify-between">
  {/* Decorative elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-0 right-0 w-40 h-40 bg-[#d4af37]/10 rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-2xl" />
  </div>

  {/* Title */}
  <div className="relative z-10">
    <h2 className="text-3xl font-serif font-light text-white flex items-center gap-3">
      <IconName className="w-8 h-8 text-[#d4af37]" />
      Modal Title
    </h2>
    <p className="text-[#f8f6f3]/70 text-sm mt-1">Subtitle or description</p>
  </div>

  {/* Close Button */}
  <button
    onClick={onClose}
    className="relative z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
  >
    <X className="w-5 h-5" />
  </button>
</div>
```

**Design Elements**:
- Gradient background (dark to slightly lighter)
- Decorative blur circles (gold accent with low opacity)
- Icon + Title + Subtitle layout
- Close button with hover state
- All elements layered with `z-index` for proper depth
- Minimum height for prominence (`h-32`)

### 4. **Content Section**
```jsx
<div className="p-8">
  {/* Grid for dual-column layouts */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {/* Left Column */}
    {/* Right Column */}
  </div>

  {/* Summary/Info Card */}
  <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-[#faf8f5] to-[#f0ece3] border border-[#d4af37]/20">
    <p className="text-sm text-[#1a1f2e]">
      <span className="font-medium">Label:</span> <span className="text-[#d4af37]">Value</span>
    </p>
  </div>
</div>
```

**Features**:
- Generous padding (`p-8`)
- Responsive grid layout
- Light background for content sections
- Accent colors for important information
- Subtle borders and shadows

### 5. **Input Styling**
```jsx
<input
  type="text"
  placeholder="Search..."
  className="w-full px-4 py-3 rounded-xl border border-[#e0dbd3] bg-[#faf8f5] text-[#1a1f2e] placeholder:text-[#1a1f2e]/40 focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all duration-300"
/>
```

**Features**:
- Rounded corners (`rounded-xl`)
- Subtle borders
- Gold focus state
- Smooth transitions
- Placeholder text styling

### 6. **Selection Lists**
```jsx
<div className="space-y-2 h-64 overflow-y-auto pr-2 custom-scrollbar">
  {items.map((item) => (
    <button
      key={item.id}
      onClick={() => handleSelect(item)}
      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
        isSelected
          ? "bg-[#d4af37] text-white font-medium shadow-lg shadow-[#d4af37]/30"
          : "bg-[#f8f6f3] text-[#1a1f2e] hover:bg-[#f0ece3] border border-[#e0dbd3]"
      }`}
    >
      {item.name}
    </button>
  ))}
</div>
```

**Features**:
- Scrollable container with custom scrollbar
- Clear selected state (gold background)
- Hover states (lighter background)
- Smooth transitions
- Full-width buttons for easy clicking

### 7. **Custom Scrollbar**
```jsx
<style>{`
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #d4af37;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #c9a532;
  }
`}</style>
```

**Features**:
- Thin, elegant scrollbar (`6px`)
- Gold color matching theme
- Rounded corners
- Darker hover state
- Transparent track

### 8. **Footer Section**
```jsx
<div className="flex items-center gap-3 px-8 py-4 bg-[#faf8f5] border-t border-[#e0dbd3]">
  <button className="flex-1 px-6 py-3 rounded-xl border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/5 transition-all duration-300 font-medium">
    Cancel
  </button>
  <button className="flex-1 px-6 py-3 rounded-xl bg-[#d4af37] text-[#1a1f2e] hover:bg-[#c9a532] shadow-lg hover:shadow-xl transition-all duration-300 font-medium">
    Apply
  </button>
</div>
```

**Features**:
- Border separator from content
- Dual button layout (Cancel/Apply)
- Secondary button: outlined gold
- Primary button: filled gold
- Responsive button sizing (`flex-1`)

---

## Animation Patterns

### Entry Animation
```jsx
initial={{ opacity: 0, scale: 0.95, y: 20 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.95, y: 20 }}
transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
```
- Slight scale-up + fade-in effect
- Quick entrance (300ms)
- Custom easing for natural feel

### Element Animations
- **Backdrop**: Simple fade (`opacity: 0 → 1`)
- **Modal**: Scale + fade + slide
- **Buttons**: Scale on hover (`whileHover={{ scale: 1.05 }}`)

---

## Usage Template

```jsx
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, IconName } from "lucide-react";

export function CustomModal({ isOpen, onClose }) {
  const [selectedValue, setSelectedValue] = useState(null);

  const handleApply = () => {
    // Apply logic here
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
          >
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative h-32 bg-gradient-to-r from-[#1a1f2e] via-[#2a3f5f] to-[#1a1f2e] px-8 py-6 flex items-center justify-between">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#d4af37]/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-2xl" />
                </div>

                <div className="relative z-10">
                  <h2 className="text-3xl font-serif font-light text-white flex items-center gap-3">
                    <IconName className="w-8 h-8 text-[#d4af37]" />
                    Modal Title
                  </h2>
                  <p className="text-[#f8f6f3]/70 text-sm mt-1">Description</p>
                </div>

                <button
                  onClick={onClose}
                  className="relative z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Add your content here */}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-3 px-8 py-4 bg-[#faf8f5] border-t border-[#e0dbd3]">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/5 transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 px-6 py-3 rounded-xl bg-[#d4af37] text-[#1a1f2e] hover:bg-[#c9a532] shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                >
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

---

## Color Palette

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Primary Accent | Gold | `#d4af37` | Buttons, highlights, focus states |
| Primary Dark | Dark Navy | `#1a1f2e` | Headers, main text |
| Primary Light | Off-white | `#faf8f5` | Backgrounds, cards |
| Secondary Text | Muted Blue | `#9baab8` | Subtitles, secondary info |
| Borders | Light Tan | `#e0dbd3` | Input borders, dividers |
| Dark Gradient | Navy Gradient | `#1a1f2e → #2a3f5f` | Header background |

---

## Responsive Behavior

### Mobile (< 768px)
- Modal uses `max-w-2xl` with `px-4` for padding
- Single column layout for content
- Header remains prominent but compact
- Buttons stack if needed

### Tablet & Desktop
- Full width up to `max-w-2xl`
- Grid layouts expand to multiple columns
- Generous padding maintained
- All transitions and animations smooth

---

## Accessibility

- ✅ Backdrop dismissable (click outside)
- ✅ Close button always visible
- ✅ Keyboard navigation support (ESC key)
- ✅ Focus states on interactive elements
- ✅ Sufficient color contrast
- ✅ Clear hierarchy and labeling

---

## Implementation Checklist

When creating a new modal:

- [ ] Use `AnimatePresence` wrapper
- [ ] Add backdrop with blur effect
- [ ] Gradient header with decorative circles
- [ ] Icon + Title + Subtitle in header
- [ ] Close button in header
- [ ] Responsive grid layout for content
- [ ] Custom scrollbar styling
- [ ] Footer with Cancel/Apply buttons
- [ ] Proper z-index layering (40 = backdrop, 50 = modal)
- [ ] Smooth animations (300ms duration)
- [ ] Gold accent color for highlights
- [ ] Hover states on all interactive elements

---

## Related Files

- **Component**: [CurrencyModal.jsx](../src/app/components/modals/CurrencyModal.jsx)
- **Context**: [CurrencyContext.jsx](../src/context/CurrencyContext.jsx)
- **Styling**: Uses Tailwind CSS classes (configured in `tailwind.config.js`)

