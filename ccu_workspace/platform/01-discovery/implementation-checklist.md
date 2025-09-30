# 🚀 A123 Battery EMS - Simplified Implementation Checklist

## Quick Start Guide
Focus on modifying existing code, not rebuilding from scratch. Work incrementally, test often.

---

## 📋 Phase 1: Data Model Updates (Day 1-2)

### 1.1 Update Prisma Schema
**File:** `prisma/schema.prisma`

- [ ] **RENAME** `Asset` model to `BatteryContainer`
- [ ] **ADD** these fields to BatteryContainer:
  ```prisma
  soc             Float    // State of Charge %
  soh             Float    // State of Health %
  cycleCount      Int
  productModel    String   // "40ft" | "20ft-A" | etc
  serialNumber    String   @unique
  voltageClass    String   // "1500V" | "800V"
  ```
- [ ] **REMOVE** field: `type` (no longer need solar/wind/battery types)
- [ ] **RUN** `npx prisma migrate dev --name battery-focus`

### 1.2 Update API Routes
**Files to modify:**

- [ ] `app/api/assets/route.ts` → Rename to `app/api/battery/route.ts`
  - Update queries to use `BatteryContainer` model
  - Remove solar/wind specific logic
- [ ] Keep authentication APIs as-is (they work fine)

---

## 🎨 Phase 2: Quick Visual Updates (Day 3-4)

### 2.1 Add A123 Colors
**File:** `app/globals.css`

- [ ] **ADD** at the top:
  ```css
  :root {
    --a123-orange: #FF8C00;
    --a123-dark-bg: #1A1D23;
    --a123-card-bg: #252932;
    --a123-border: #3A3F4B;
  }
  ```

### 2.2 Update Main Layout
**File:** `app/layout.tsx`

- [ ] Change background color class to `bg-[#1A1D23]`
- [ ] Update title to "A123 Battery EMS"

### 2.3 Quick Component Updates
- [ ] **UPDATE** all Card components:
  - Change `bg-white` to `bg-[#252932]`
  - Change `border-gray-200` to `border-[#3A3F4B]`
  - Add hover effect: `hover:border-[#FF8C00]`

---

## 🗑️ Phase 3: Remove Non-Battery Code (Day 5)

### 3.1 Delete These Files
```bash
# Run these commands:
rm -rf app/assets/solar/
rm -rf app/assets/wind/
rm -rf app/assets/substation/
rm components/charts/SolarCharts.tsx
rm components/charts/WindCharts.tsx
rm lib/simulators/solar-data.ts
rm lib/simulators/wind-data.ts
```

### 3.2 Clean Up Imports
- [ ] Search project for "solar", "wind", "substation" imports
- [ ] Remove or comment out these imports
- [ ] Fix any broken imports

---

## ✨ Phase 4: Add Battery-Specific Features (Day 6-8)

### 4.1 Update Dashboard
**File:** `app/dashboard/page.tsx`

- [ ] **REPLACE** asset type cards with:
  ```tsx
  <Card>
    <CardHeader>
      <CardTitle>Fleet Overview</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div>Total Containers: {containerCount}</div>
        <div>Average SOC: {avgSOC}%</div>
        <div>Average SOH: {avgSOH}%</div>
        <div>Active Alerts: {alertCount}</div>
      </div>
    </CardContent>
  </Card>
  ```

### 4.2 Create Simple Battery Chart
**New file:** `components/charts/BatteryChart.tsx`

- [ ] **CREATE** basic SOC/SOH chart:
  ```tsx
  export function BatteryChart({ data }) {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <Line type="monotone" dataKey="soc" stroke="#FF8C00" name="SOC %" />
          <Line type="monotone" dataKey="soh" stroke="#10B981" name="SOH %" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    )
  }
  ```

### 4.3 Update Map Markers
**File:** `components/map/AssetMarker.tsx`

- [ ] **MODIFY** marker color logic:
  ```tsx
  const getMarkerColor = (container) => {
    if (container.status === 'offline') return '#4B5563'
    if (container.soc < 20) return '#EF4444' // Red if low battery
    if (container.soc < 50) return '#F59E0B' // Yellow if medium
    return '#10B981' // Green if good
  }
  ```

---

## 🚨 Phase 5: Update Alert System (Day 9-10)

### 5.1 Update Alert Model
**File:** `prisma/schema.prisma`

- [ ] **MODIFY** Alert model:
  ```prisma
  model Alert {
    severity  String  // "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
    category  String  // "SAFETY" | "PERFORMANCE" | "MAINTENANCE" | "INFO"
    // ... rest stays same
  }
  ```

### 5.2 Update Alert Colors
**File:** `app/alerts/page.tsx`

- [ ] **UPDATE** severity colors:
  ```tsx
  const severityColors = {
    CRITICAL: 'bg-red-500',
    HIGH: 'bg-orange-500',
    MEDIUM: 'bg-yellow-500',
    LOW: 'bg-blue-500'
  }
  ```

---

## 📊 Phase 6: Battery-Specific Pages (Day 11-12)

### 6.1 Create Battery Health Page
**New file:** `app/battery-health/page.tsx`

- [ ] **CREATE** simple page showing:
  - SOH trends graph
  - Cycle count table
  - Degradation rate

### 6.2 Update Reports Page
**File:** `app/reports/page.tsx`

- [ ] **REMOVE** solar/wind report sections
- [ ] **ADD** battery report types:
  - Daily Operations Report
  - Battery Health Report
  - Financial Performance

---

## 🔧 Phase 7: Update Existing Components (Day 13-14)

### 7.1 Navigation Menu
**File:** `components/Navigation.tsx` (or similar)

- [ ] **UPDATE** menu items:
  ```tsx
  const menuItems = [
    { href: '/dashboard', label: 'Fleet Dashboard' },
    { href: '/battery-health', label: 'Battery Health' },
    { href: '/alerts', label: 'Alerts' },
    { href: '/map', label: 'Fleet Map' },
    { href: '/reports', label: 'Reports' }
  ]
  ```

### 7.2 Status Badges
**File:** `components/ui/StatusBadge.tsx`

- [ ] **UPDATE** for battery modes:
  ```tsx
  const modes = {
    charging: { color: 'bg-blue-500', label: 'Charging' },
    discharging: { color: 'bg-orange-500', label: 'Discharging' },
    standby: { color: 'bg-gray-500', label: 'Standby' }
  }
  ```

---

## ✅ Phase 8: Testing & Cleanup (Day 15)

### 8.1 Test Core Functions
- [ ] Login/logout works
- [ ] Dashboard loads
- [ ] Map displays containers
- [ ] Alerts show up
- [ ] Reports generate

### 8.2 Update Seed Data
**File:** `prisma/seed.ts`

- [ ] **MODIFY** to create BatteryContainer records instead of Assets
- [ ] Use A123 product models
- [ ] Add SOC/SOH values

### 8.3 Final Cleanup
- [ ] Remove unused imports
- [ ] Delete commented code
- [ ] Update README.md
- [ ] Test build: `npm run build`

---

## 🎯 Quick Wins Checklist

If you only have a few hours, do these first:

1. [ ] Update colors to A123 orange
2. [ ] Rename "Assets" to "Battery Containers" in UI
3. [ ] Remove solar/wind menu items
4. [ ] Update dashboard cards
5. [ ] Change app title

---

## 📝 Notes

- **Don't worry about:** Perfect implementation on first pass
- **Do worry about:** Keeping the app functional at each step
- **Test often:** Run the app after each phase
- **Commit often:** Make small commits for easy rollback

---

## 🚦 Go/No-Go Checkpoints

### After Phase 1-2:
- App still runs? ✓ Continue
- Login works? ✓ Continue

### After Phase 3-4:
- Dashboard shows data? ✓ Continue
- No broken pages? ✓ Continue

### After Phase 5-8:
- All core features work? ✓ Deploy to staging
- Performance acceptable? ✓ Ready for production

---

**Total Time Estimate:** 15 working days (3 weeks)
**Effort Level:** Medium
**Risk:** Low (incremental changes)