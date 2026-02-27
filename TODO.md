# Add Tenant to Release Page - Implementation Plan

## Steps to Complete:

- [x] 1. Create AddTenantModal.tsx component
- [x] 2. Modify tenantListAccordians.tsx to add "Add Tenant" button and integrate modal
- [x] 3. Modify CustomAccordion to pass index in renderContent callback
- [ ] 4. Test the implementation

## Details:

### Step 1: Create AddTenantModal.tsx

- Create new modal component in release-table/(components)/
- Fields: Tenant Name, Status (dropdown), Android Version, iOS Version
- API call to AddTenant endpoint

### Step 2: Modify tenantListAccordians.tsx

- Add state for modal visibility
- Add "Add Tenant" button at top of first accordion content
- Show button only for latest release (first accordion)
- Pass latest release version to modal subtitle

### Step 3: Modify CustomAccordion

- Added index parameter to renderContent callback
- Allows determining first accordion for "Add Tenant" button
