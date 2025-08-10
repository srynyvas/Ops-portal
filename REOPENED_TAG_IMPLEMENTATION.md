# Reopened Tag Implementation

## Overview

Reopened releases now display an additional "reopened" tag alongside the "active" status, providing clear visual distinction for releases that have been reopened after being closed.

## Implementation Details

### 1. Data Model Enhancement

**Frontend Type (releases.ts)**
```typescript
export interface Release {
  // ... existing fields
  status: 'active' | 'closed' | 'archived';
  isReopened?: boolean;  // New field to track reopened status
  // ... other fields
}
```

**Backend Model (main_mongo_updated.py)**
```python
class Release(Document):
    # ... existing fields
    status: str = "active"
    isReopened: bool = False  # New field
    statusHistory: List[StatusHistoryEntry] = []
    # ... other fields
```

### 2. Visual Indicators

Reopened releases display:
- **Primary Status Badge**: Green "active" badge
- **Secondary Reopened Badge**: Amber "reopened" badge
- **Color Scheme**: Amber/orange to indicate caution/attention needed

### 3. UI Display

The reopened tag appears in:
- Release card listings (catalogue view)
- Individual release cards
- Both active and closed tabs (when filtering)

#### Badge Implementation
```tsx
<div className="absolute top-2 right-2 flex gap-1">
  <span className="bg-green-100 text-green-800">active</span>
  {release.isReopened && (
    <span className="bg-amber-100 text-amber-800 font-medium">
      reopened
    </span>
  )}
</div>
```

## How It Works

### Reopening Process

1. User clicks "Reopen" on a closed release
2. Enters mandatory reason for reopening
3. System sets:
   - `status: "active"`
   - `isReopened: true`
   - Adds entry to `statusHistory`
4. Release saves to MongoDB with reopened flag
5. UI displays both "active" and "reopened" badges

### Data Flow

```
User Action → Set isReopened=true → Save to MongoDB → Display Tags
```

## Visual Design

### Badge Styling
- **Active Badge**: `bg-green-100 text-green-800`
- **Reopened Badge**: `bg-amber-100 text-amber-800`
- **Layout**: Horizontal flex with 4px gap
- **Position**: Top-right corner of release card

### Color Psychology
- **Green**: Active, in progress
- **Amber**: Attention needed, previously closed
- **Combination**: Shows both current state and history

## Benefits

1. **Instant Recognition**: Users immediately see which releases were reopened
2. **Audit Trail**: Visual indicator complements status history
3. **Priority Awareness**: Reopened releases often need special attention
4. **Filtering**: Can potentially filter by reopened status
5. **Compliance**: Clear documentation of release lifecycle

## Testing

### Test Coverage
✅ isReopened field persists in MongoDB
✅ Badge displays correctly in UI
✅ Status history maintains complete audit trail
✅ Active and reopened badges display together

### Test Commands
```bash
# Test reopened tag functionality
python test_reopened_tag.py

# Verify in MongoDB
docker exec ops_portal_mongodb mongosh ops_portal \
  --eval "db.releases.find({isReopened: true})"
```

## Example MongoDB Document

```json
{
  "_id": "6898e210f321b22c4ae16b6d",
  "name": "Q1 2024 Release",
  "status": "active",
  "isReopened": true,
  "statusHistory": [
    {
      "action": "closed",
      "reason": "Initial release complete",
      "timestamp": "2025-08-10T20:00:00Z"
    },
    {
      "action": "reopened",
      "reason": "Critical bug found in production",
      "timestamp": "2025-08-10T23:00:00Z"
    }
  ]
}
```

## UI Examples

### Release Card Display
```
┌─────────────────────────────────┐
│ Release Name          [active][reopened] │
│ Version: 2.0.0                   │
│ Progress: 75%                    │
│                                  │
│ [Load] [Close] [Duplicate]       │
└─────────────────────────────────┘
```

### Status Combinations
- **New Release**: `[active]`
- **Reopened Release**: `[active][reopened]`
- **Closed Release**: `[closed]`
- **Archived Release**: `[archived]`

## Future Enhancements

1. **Filtering**: Add filter option for reopened releases
2. **Analytics**: Track how many times releases get reopened
3. **Notifications**: Alert stakeholders when releases reopen
4. **Auto-Clear**: Option to clear reopened flag after certain actions
5. **History View**: Show reopened count in release history

## Summary

The reopened tag implementation provides:
- Clear visual distinction for reopened releases
- Persistent tracking in MongoDB
- Amber color coding for attention
- Complete audit trail with reasons
- Better release lifecycle visibility

This helps teams quickly identify releases that required additional work after initial closure, improving transparency and project management.