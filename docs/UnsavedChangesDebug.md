# Unsaved Changes Debug Guide

## Common Issues and Fixes

### Issue: Modal Not Showing During Navigation

If the unsaved changes modal isn't appearing when you navigate to other tabs or pages, check the following:

1. **Make sure you're using the correct hook**:

   - Import from `@/hooks/useUnsavedChanges` not from the context

2. **Verify proper hook usage**:

   ```tsx
   const { showModal, blockNavigation, continueEditing, discardChanges } =
     useUnsavedChanges(isDirty);
   ```

3. **Include the modal in your component**:

   ```tsx
   <UnsavedChangesModal
     isOpen={showModal}
     onContinue={continueEditing}
     onDiscard={discardChanges}
   />
   ```

4. **Restart your development server**:
   Custom event listeners might need a server restart to work properly.
5. **Check the z-index**:
   The modal has a high z-index (9999) but if other elements have a higher z-index, they might cover it.

### Testing the Modal

Add this temporary code to any component to test if the modal appears:

```tsx
import React, { useState } from "react";
import useUnsavedChanges from "@/hooks/useUnsavedChanges";
import UnsavedChangesModal from "@/components/UnsavedChangesModal";

const TestUnsavedChanges = () => {
  const [isDirty, setIsDirty] = useState(false);

  const { showModal, blockNavigation, continueEditing, discardChanges } =
    useUnsavedChanges(isDirty);

  return (
    <div className="p-4 border border-gray-300 rounded mt-4">
      <h2 className="text-lg font-bold mb-2">Test Unsaved Changes</h2>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={isDirty}
          onChange={(e) => setIsDirty(e.target.checked)}
          id="isDirty"
        />
        <label htmlFor="isDirty">Simulate unsaved changes</label>
      </div>

      <div className="flex gap-2">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={() => blockNavigation(() => alert("Action was allowed"))}
        >
          Test Block Navigation
        </button>
      </div>

      <UnsavedChangesModal
        isOpen={showModal}
        onContinue={continueEditing}
        onDiscard={discardChanges}
      />
    </div>
  );
};

export default TestUnsavedChanges;
```

Add this component to any page to test the unsaved changes system.

### Manual Debug Steps

1. Check browser console for any JavaScript errors
2. Add console logs to track state changes:

   ```tsx
   useEffect(() => {
     console.log("isDirty changed:", isDirty);
   }, [isDirty]);

   useEffect(() => {
     console.log("showModal changed:", showModal);
   }, [showModal]);
   ```

3. Verify the custom event is firing by adding this to your component:
   ```tsx
   useEffect(() => {
     const logNavigationEvent = (event) => {
       console.log("Navigation event detected:", event.detail);
     };

     window.addEventListener("navigationChanged", logNavigationEvent);
     return () =>
       window.removeEventListener("navigationChanged", logNavigationEvent);
   }, []);
   ```
