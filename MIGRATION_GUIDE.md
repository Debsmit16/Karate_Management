# Migration Guide: From In-Memory Store to Supabase

This guide helps you migrate from the in-memory Zustand store to the Supabase-backed store.

## Overview

The application now has two store implementations:
- `useStore.ts` - Legacy in-memory store (for reference/testing)
- `useSupabaseStore.ts` - Supabase-backed store (production)

## Step 1: Update Imports

Replace all imports from `useStore` to `useSupabaseStore`:

**Before:**
```typescript
import { useStore } from '../store/useStore';
```

**After:**
```typescript
import { useSupabaseStore } from '../store/useSupabaseStore';
```

## Step 2: Update Store Usage

### Fetching Data

The Supabase store requires explicit fetching:

**Before:**
```typescript
const tournaments = useStore((state) => state.tournaments);
```

**After:**
```typescript
const tournaments = useSupabaseStore((state) => state.tournaments);
const fetchTournaments = useSupabaseStore((state) => state.fetchTournaments);

useEffect(() => {
  fetchTournaments();
}, [fetchTournaments]);
```

### Adding Data

**Before:**
```typescript
const addTournament = useStore((state) => state.addTournament);
addTournament(tournament);
```

**After:**
```typescript
const addTournament = useSupabaseStore((state) => state.addTournament);
await addTournament(tournament); // Now async!
```

## Step 3: Update All Pages

### AdminDashboard.tsx

```typescript
// Add useEffect for fetching
useEffect(() => {
  fetchTournaments();
}, [fetchTournaments]);

// Update addTournament to be async
const handleCreateTournament = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await addTournament({
      name: formData.name,
      level: formData.level,
      events: formData.events,
      teamChampionshipEnabled: formData.teamChampionshipEnabled,
      status: 'draft',
    });
    // ... rest of code
  } catch (error) {
    console.error('Error creating tournament:', error);
  }
};
```

### Similar Updates Needed For:

- `TournamentDetail.tsx` - Fetch categories
- `CategoryDetail.tsx` - Fetch matches and athletes
- `MatchScoring.tsx` - Fetch and update scores
- `CoachDashboard.tsx` - Fetch teams, athletes, results

## Step 4: Handle Loading States

The Supabase store includes loading states:

```typescript
const loadingTournaments = useSupabaseStore((state) => state.loadingTournaments);

if (loadingTournaments) {
  return <div>Loading tournaments...</div>;
}
```

## Step 5: Error Handling

All Supabase operations can throw errors:

```typescript
try {
  await addTournament(tournament);
} catch (error) {
  console.error('Error:', error);
  // Show user-friendly error message
}
```

## Step 6: Real-time Updates (Optional)

Supabase supports real-time subscriptions. You can add them for live updates:

```typescript
useEffect(() => {
  const channel = supabase
    .channel('tournaments')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'tournaments' },
      () => {
        fetchTournaments();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [fetchTournaments]);
```

## Complete Example

Here's a complete example of migrating a component:

**Before:**
```typescript
import { useStore } from '../store/useStore';

export default function MyComponent() {
  const tournaments = useStore((state) => state.tournaments);
  const addTournament = useStore((state) => state.addTournament);
  
  const handleAdd = () => {
    addTournament({ id: '1', name: 'Test', ... });
  };
  
  return <div>{tournaments.map(...)}</div>;
}
```

**After:**
```typescript
import { useEffect } from 'react';
import { useSupabaseStore } from '../store/useSupabaseStore';

export default function MyComponent() {
  const tournaments = useSupabaseStore((state) => state.tournaments);
  const loadingTournaments = useSupabaseStore((state) => state.loadingTournaments);
  const fetchTournaments = useSupabaseStore((state) => state.fetchTournaments);
  const addTournament = useSupabaseStore((state) => state.addTournament);
  
  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);
  
  const handleAdd = async () => {
    try {
      await addTournament({ name: 'Test', ... });
      // Tournament will be refetched automatically
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  if (loadingTournaments) {
    return <div>Loading...</div>;
  }
  
  return <div>{tournaments.map(...)}</div>;
}
```

## Testing the Migration

1. Start with one page at a time
2. Test all CRUD operations
3. Verify data persists after page refresh
4. Check that RLS policies work correctly
5. Test with different user roles

## Rollback Plan

If you need to rollback:
1. Keep the old `useStore.ts` file
2. Revert imports back to `useStore`
3. Remove `useEffect` hooks for fetching
4. Data will be in-memory only (not persisted)

## Notes

- All Supabase operations are async
- Data is automatically refetched after mutations
- Loading states are available for better UX
- Errors should be handled gracefully
- Real-time updates are optional but recommended

