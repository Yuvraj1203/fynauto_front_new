# TODO: Fix CustomTable Multi-selection

## Task

Fix the custom table for multiselection so that:

- Selected keys are passed to parent as an array
- Parent can control selection via array
- "All" selection returns all item IDs as array
- Selection handling is smooth without lag

## Steps

### Step 1: Fix CustomTable (customTable.tsx)

- [x] Read and understand current implementation
- [x] Remove internal useState for selection (make it fully controlled)
- [x] Properly handle "all" selection - return all item IDs as array
- [x] Fix onSelectionChange to directly pass array to parent (not via useEffect)
- [x] Handle array type for selectedValue prop

### Step 2: Update Parent Component (tenantReleaseTable.tsx)

- [x] Change tableSelection from Set to array (string[])
- [x] Pass array to selectedValue prop
- [x] Handle array in onSelectionChange callback

### Step 3: Test

- [x] Verify multi-selection works
- [x] Verify "Select All" returns array of all IDs
- [x] Verify single selection works
- [x] TypeScript compiles without errors
