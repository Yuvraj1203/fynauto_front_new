# TODO: Add Teams Channel Checkbox to AzureTokenModal

## Task Summary

Add a customCheckbox for "Build for Teams Channel" option to the AzureTokenModal component.

## Steps to Complete:

1. [x] Add `teamsChannel` state variable to AzureTokenModal.tsx
2. [x] Add Teams Channel customCheckbox component in the modal
3. [x] Include teamsChannel in the API request payload
4. [x] Reset teamsChannel on modal close
5. [x] Add validation for teamsChannel if needed

## Files Edited:

- src/app/(routes)/(protected)/release-table/(components)/AzureTokenModal.tsx

## Follow-up Steps:

- Test single selection (Deploy, Retry buttons)
- Test multiple selection (Bulk Deploy)

## Implementation Complete ✅

All requirements from the task have been implemented:

- Deploy button, retry button, live button click → Opens customModal
- Azure token from customInput ✅
- Branch name with customAutocomplete ✅
- Select OS android iOS with customCheck box ✅
- Select Production, external testers, internal testers with customradio button ✅
- customCheckbox for buildApk build Ipa for teams channel ✅

---

# TODO: Fetch Branch Names from Azure DevOps API (Optimized with useMutation)

## Task Summary

Call the Azure DevOps API to fetch all branch names and display them in the branch name autocomplete using useMutation pattern.

## API Details:

- URL: `https://dev.azure.com/kansoftware/Thoroughbred%20Apps/_apis/git/repositories/FynancialReactNativeMobileApp/refs?filter=heads/&api-version=7.1-preview.1`
- Method: GET
- Auth: Bearer token in Authorization header (using azureToken state)

## Steps to Complete:

1. [x] Updated apiInstance.ts to support full URLs via `url` parameter
2. [x] Add types for Azure DevOps branch API response
3. [x] Add useMutation for fetching branches with makeRequest
4. [x] Use full URL in makeRequest call for third-party API
5. [x] Transform API response to branch list format
6. [x] Update CustomAutoComplete to use dynamic branch list
7. [x] Add fallback to initial branch list if API fails
8. [x] Reset branch list on modal close

## Files Edited:

- src/services/apiInstance.ts - Added url parameter support
- src/app/(routes)/(protected)/release-table/(components)/AzureTokenModal.tsx

## Implementation Complete ✅

The branch names are now fetched using useMutation pattern with makeRequest. The apiInstance now supports full URLs for third-party APIs.
