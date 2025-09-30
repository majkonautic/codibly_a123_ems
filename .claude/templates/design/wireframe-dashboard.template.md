# Dashboard Wireframe Template

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ┌──────────┬──────────────────────────────────────────────────────────┐ │
│ │  [LOGO]  │                    Top Navigation Bar                     │ │
│ │          │  ┌─────────┬─────────┬─────────┬─────────┬────────────┐  │ │
│ │          │  │  Home   │ Products│ Reports │Settings │ User Profile│  │ │
│ │          │  └─────────┴─────────┴─────────┴─────────┴────────────┘  │ │
│ ├──────────┼──────────────────────────────────────────────────────────┤ │
│ │          │                                                           │ │
│ │  SIDEBAR │                    Main Content Area                      │ │
│ │          │                                                           │ │
│ │ ─────────│  ┌──────────────────┬──────────────────┬──────────────┐  │ │
│ │          │  │                  │                  │              │  │ │
│ │ Dashboard│  │   Metric Card 1  │   Metric Card 2  │ Metric Card 3│  │ │
│ │ Analytics│  │   ┌──────────┐   │   ┌──────────┐   │  ┌────────┐ │  │ │
│ │ Users    │  │   │  $1,234  │   │   │   456    │   │  │  78%   │ │  │ │
│ │ Settings │  │   └──────────┘   │   └──────────┘   │  └────────┘ │  │ │
│ │ Reports  │  │   Revenue Today  │   Active Users   │  Conversion │  │ │
│ │          │  └──────────────────┴──────────────────┴──────────────┘  │ │
│ │ ─────────│                                                           │ │
│ │          │  ┌────────────────────────────────────────────────────┐  │ │
│ │ Support  │  │                                                    │  │ │
│ │ Logout   │  │                  Chart/Graph Area                  │  │ │
│ │          │  │                                                    │  │ │
│ │          │  │     ▲                                              │  │ │
│ │          │  │     │     ╱╲                                       │  │ │
│ │          │  │     │    ╱  ╲    ╱╲                               │  │ │
│ │          │  │     │   ╱    ╲  ╱  ╲                              │  │ │
│ │          │  │     │__╱______╲╱____╲___________▶                 │  │ │
│ │          │  │                                                    │  │ │
│ │          │  └────────────────────────────────────────────────────┘  │ │
│ │          │                                                           │ │
│ │          │  ┌────────────────────────────────────────────────────┐  │ │
│ │          │  │                                                    │  │ │
│ │          │  │               Data Table Section                   │  │ │
│ │          │  │  ┌──────┬──────────┬───────────┬────────┬───────┐ │  │ │
│ │          │  │  │  ID  │   Name   │   Status  │  Date  │Action │ │  │ │
│ │          │  │  ├──────┼──────────┼───────────┼────────┼───────┤ │  │ │
│ │          │  │  │ 001  │ Item 1   │  Active   │01/01/24│ [···] │ │  │ │
│ │          │  │  │ 002  │ Item 2   │  Pending  │01/02/24│ [···] │ │  │ │
│ │          │  │  │ 003  │ Item 3   │  Complete │01/03/24│ [···] │ │  │ │
│ │          │  │  └──────┴──────────┴───────────┴────────┴───────┘ │  │ │
│ │          │  │                                                    │  │ │
│ │          │  └────────────────────────────────────────────────────┘  │ │
│ └──────────┴──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

## Component Mapping

### shadcn/ui Components Used:
- **Navigation**: `NavigationMenu`, `Sidebar`
- **Cards**: `Card` with `CardHeader`, `CardContent`
- **Data Display**: `Table`, `Badge`
- **Charts**: `Chart` (recharts integration)
- **Layout**: `Separator`, `ScrollArea`
- **Actions**: `Button`, `DropdownMenu`

## Responsive Behavior

### Mobile (< 768px)
- Sidebar collapses to hamburger menu
- Cards stack vertically
- Table becomes scrollable horizontally

### Tablet (768px - 1024px)
- Sidebar remains visible but narrower
- Cards in 2-column grid
- Full table visible

### Desktop (> 1024px)
- Full layout as shown above
- All elements visible
- Optimal spacing

## Color Coding
- Primary actions: Blue
- Success states: Green
- Warning states: Yellow
- Error states: Red
- Neutral/disabled: Gray

## Interaction States
- Hover: Slight elevation/highlight
- Active: Pressed state with shadow
- Focus: Outline for accessibility
- Loading: Skeleton screens
- Empty: Placeholder content