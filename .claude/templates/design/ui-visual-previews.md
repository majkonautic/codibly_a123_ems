# UI Visual Previews for CCU Design Command

## Authentication UI Styles

### Split Screen Login
```
┌──────────┬──────────┐
│  Brand   │  LOGIN   │  → 50/50 split
│  Image   │  ┌────┐  │  → Professional look
│          │  │Form│  │
│          │  └────┘  │
└──────────┴──────────┘
```
→ https://ui.shadcn.com/blocks/login#login-04

### Centered Simple Login
```
┌──────────────────┐
│                  │  → Minimal design
│     ┌────┐       │  → Quick access
│     │Form│       │
│     └────┘       │
└──────────────────┘
```
→ https://ui.shadcn.com/blocks/login#login-01

### With Background Login
```
┌──────────────────┐
│░░░░░░░░░░░░░░░░░░│  → Muted background
│░░░░┌────┐░░░░░░░░│  → Modern look
│░░░░│Form│░░░░░░░░│
│░░░░└────┘░░░░░░░░│
└──────────────────┘
```
→ https://ui.shadcn.com/blocks/login#login-03

## Dashboard Layouts

### Cards & Charts
```
┌──────┐ ┌──────┐ ┌──────┐
│ KPI  │ │ KPI  │ │ KPI  │  → Visual metrics
│ $100 │ │ $250 │ │ $75  │  → Quick scanning
│ ▲12% │ │ ▼5%  │ │ ▲8%  │
└──────┘ └──────┘ └──────┘
┌─────────┬───────────┐
│ 📈 Line │ 🥧 Pie    │  → Visual analytics
└─────────┴───────────┘
```
→ https://ui.shadcn.com/blocks/dashboard#dashboard-01

### Data Tables
```
┌─────────────────────────────┐
│ Name    │ Status │ Amount   │  → Sortable
├─────────┼────────┼──────────┤  → Filterable
│ Item 1  │ Active │ $100.00  │  → Paginated
│ Item 2  │ Pending│ $250.00  │
└─────────┴────────┴──────────┘
```
→ https://ui.shadcn.com/docs/components/data-table

### Mixed View
```
┌──────────────────────────┐
│ Cards    │ Charts        │  → Balanced layout
├──────────┴───────────────┤  → Best of both
│ Data Table               │
└──────────────────────────┘
```
→ https://ui.shadcn.com/blocks/dashboard

## Data Display Styles

### Table View
```
┌─────────────────────────────┐
│ Name    │ Status │ Amount   │  → Structured data
├─────────┼────────┼──────────┤  → Sortable columns
│ Item 1  │ Active │ $100.00  │  → Bulk actions
│ Item 2  │ Pending│ $250.00  │
└─────────┴────────┴──────────┘
```
→ https://ui.shadcn.com/docs/components/table

### Card Grid
```
┌──────┐ ┌──────┐ ┌──────┐
│ Card │ │ Card │ │ Card │  → Visual appeal
│ Data │ │ Data │ │ Data │  → Quick overview
│ ••••• │ │ ••••• │ │ ••••• │  → Mobile friendly
└──────┘ └──────┘ └──────┘
```
→ https://ui.shadcn.com/docs/components/card

### List View
```
┌─────────────────────────┐
│ • Item with description │  → Detailed info
│   Secondary text here   │  → Good for tasks
├─────────────────────────┤  → Scannable
│ • Another item          │
│   More details          │
└─────────────────────────┘
```
→ https://ui.shadcn.com/blocks#lists

## Grid Layouts

### Auto-fit Grid (Responsive)
```
┌─────┬─────┬─────┬─────┐
│ Card│ Card│ Card│ Card│  → Auto-adjusts columns
├─────┼─────┼─────┴─────┤  → Perfect for dashboards
│ Card│ Card│   Card    │
└─────┴─────┴───────────┘
```
CSS: `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))`

### Fixed Responsive Grid
```
Mobile      Tablet        Desktop
┌─────┐    ┌───┬───┐    ┌──┬──┬──┬──┐
│     │    │   │   │    │  │  │  │  │
├─────┤    ├───┼───┤    ├──┼──┼──┼──┤
│     │    │   │   │    │  │  │  │  │
└─────┘    └───┴───┘    └──┴──┴──┴──┘
```
Tailwind: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`

### Asymmetric Grid
```
┌───────────┬─────┬─────┐
│           │     │     │  → Hero card + smaller
│  Featured │ Card│ Card│  → Good for highlights
│           ├─────┼─────┤
│           │ Card│ Card│
└───────────┴─────┴─────┘
```
CSS: `grid-template-areas` + `span`

### Masonry/Pinterest Style
```
┌─────┐ ┌─────────┐ ┌───┐
│     │ │         │ │   │  → Variable heights
│ Card│ │  Card   │ │   │  → Natural flow
├─────┤ │         │ │Card
│     │ ├─────────┤ │   │
│ Card│ │  Card   │ ├───┤
└─────┘ └─────────┘ └───┘
```
CSS: `columns` + `break-inside-avoid`

### Bento Grid (Mixed sizes)
```
┌───────────┬───────┐
│   Large   │ Small │  → Modern dashboard
│           ├───────┤  → Different priorities
├─────┬─────┤ Small │
│ Med │ Med ├───────┤
└─────┴─────┴───────┘
```
→ https://ui.shadcn.com/blocks/dashboard

## Sidebar Styles

### Simple Grouped
```
┌──────────┐
│ MAIN     │
│ ▸ Home   │  → Clean, minimal
│ ▸ Profile│  → Best for <10 items
│          │
│ SETTINGS │
│ ▸ General│
└──────────┘
```
→ https://ui.shadcn.com/blocks/sidebar#sidebar-01

### Collapsible Sections
```
┌──────────┐
│ ▼ MAIN   │  → Expandable groups
│   Home   │  → Good for many items
│   Profile│
│ ▶ TOOLS  │
│ ▶ ADMIN  │
└──────────┘
```
→ https://ui.shadcn.com/blocks/sidebar#sidebar-02

### With Submenus
```
┌──────────┐
│ ▸ Dashboard
│ ▼ Projects│  → Nested navigation
│   └ Active│  → Deep hierarchies
│   └ Done  │
│ ▸ Settings│
└──────────┘
```
→ https://ui.shadcn.com/blocks/sidebar#sidebar-03

### Icon Collapsed
```
Full          Collapsed
┌──────────┐  ┌──┐
│ 🏠 Home  │  │🏠│  → Space-saving
│ 👤 Profile│  │👤│  → Tooltip on hover
│ ⚙️ Settings│  │⚙️│
└──────────┘  └──┘
```
→ https://ui.shadcn.com/blocks/sidebar#sidebar-07

## Theme Previews

### Professional (Slate/Neutral)
- Primary: #475569 (slate-600)
- Background: #f8fafc (slate-50)
- Text: #0f172a (slate-900)
→ https://ui.shadcn.com/themes

### Modern (Zinc/Violet)
- Primary: #7c3aed (violet-600)
- Background: #fafafa (zinc-50)
- Text: #18181b (zinc-900)
→ https://ui.shadcn.com/themes#new-york

### Friendly (Blue/Green)
- Primary: #2563eb (blue-600)
- Secondary: #16a34a (green-600)
- Background: #ffffff
→ https://ui.shadcn.com/themes#blue

### Dark Mode First
- Primary: #8b5cf6 (violet-500)
- Background: #0a0a0a
- Text: #fafafa
→ https://ui.shadcn.com/themes

## Component Visual References

### Forms
```
┌──────────┐
│ Label    │
│ [______] │  → Input field
│ [Submit] │  → Action button
└──────────┘
```
→ https://ui.shadcn.com/docs/components/form

### Charts
```
┌──────────────────┐
│     📈           │
│    /  \          │  → Line chart
│   /    \         │
│  /      \___     │
└──────────────────┘
```
→ https://ui.shadcn.com/docs/components/chart

### Navigation
```
┌─────────────────────────┐
│ Home > Products > Item  │  → Breadcrumb
└─────────────────────────┘
```
→ https://ui.shadcn.com/docs/components/breadcrumb

## Links Reference
- 🎨 All Themes: https://ui.shadcn.com/themes
- 🎨 Color Generator: https://ui.shadcn.com/colors
- 📦 All Components: https://ui.shadcn.com/docs/components
- 🏗️ All Blocks: https://ui.shadcn.com/blocks
- 📊 Dashboards: https://ui.shadcn.com/blocks#dashboard
- 🔐 Authentication: https://ui.shadcn.com/blocks#authentication