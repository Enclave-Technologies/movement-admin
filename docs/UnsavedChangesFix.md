# Unsaved Changes Navigation Fix

This guide explains how to fix the issue where the unsaved changes modal doesn't appear during navigation.

## Root Cause

The main issue is related to how Next.js App Router handles navigation events. Unlike the Pages Router, the App Router doesn't provide built-in events for navigation that we can intercept before they happen.

## Key Fixes

We've implemented the following fixes:

1. **Navigation Event Tracking**: Custom events to detect navigation
2. **Enhanced Navigation Components**: Better interception of link clicks
3. **Improved Modal Visibility**: Higher z-index and animation
4. **Debugging Tools**: Test page to verify functionality

## Test the Solution

1. Navigate to the test page at `/test-unsaved-changes`
2. Check the "Simulate unsaved changes" box
3. Try using the navigation buttons
4. The modal should appear and block navigation

## Steps to Fix Other Components

If you need to implement this in other components:

### 1. Use LinkWithUnsavedCheck for links

Replace standard Next.js links:

```tsx
// Before
<Link href="/some-page">Go to page</Link>

// After
<LinkWithUnsavedCheck
  href="/some-page"
  hasUnsavedChanges={isDirty}
  onNavigate={() => blockNavigation(() => router.push("/some-page"))}
>
  Go to page
</LinkWithUnsavedCheck>
```

### 2. Use ButtonWithUnsavedCheck for navigation buttons

```tsx
// Before
<button onClick={() => router.push("/some-page")}>Go to page</button>

// After
<ButtonWithUnsavedCheck
  onClick={() => router.push("/some-page")}
  hasUnsavedChanges={isDirty}
  onNavigateAttempt={() => blockNavigation(() => router.push("/some-page"))}
>
  Go to page
</ButtonWithUnsavedCheck>
```

### 3. Always include the UnsavedChangesModal

Make sure to add this to components using the hook:

```tsx
<UnsavedChangesModal
  isOpen={showModal}
  onContinue={continueEditing}
  onDiscard={discardChanges}
/>
```

### 4. Directly intercept dangerous actions

For other actions that aren't navigation but should be guarded:

```tsx
const handleAction = () => {
  if (isDirty) {
    blockNavigation(() => {
      // Action to perform when user confirms
      performAction();
    });
  } else {
    performAction();
  }
};
```

## Troubleshooting

If you still have issues:

1. **Restart the development server**: Event listeners need a fresh context
2. **Check console logs**: Look for JavaScript errors
3. **Verify z-index**: Ensure no other elements have a higher z-index
4. **Test with a simple component**: Use the TestUnsavedChanges component as a starting point
