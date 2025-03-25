# Unsaved Changes Warning System

This document explains the simplified approach for handling unsaved changes warnings in your application.

## Overview

The unsaved changes warning system shows a confirmation dialog when a user tries to navigate away from a page or component with unsaved changes. This helps prevent accidental data loss.

## How It Works

The system consists of three main parts:

1. **useUnsavedChanges Hook**: A React hook that manages the warning state and navigation blocking
2. **UnsavedChangesModal**: A simple modal that asks users if they want to continue editing or discard changes
3. **Integration in Components**: Implementation in components that have editable content

## Getting Started

### 1. Using the Hook

```jsx
import useUnsavedChanges from "@/hooks/useUnsavedChanges";

function MyComponent() {
  const [isDirty, setIsDirty] = useState(false);

  const {
    showModal, // Boolean to control modal visibility
    blockNavigation, // Function to block navigation and show warning
    continueEditing, // Function to continue editing (cancel navigation)
    discardChanges, // Function to discard changes and proceed with navigation
  } = useUnsavedChanges(isDirty);

  // ... your component logic
}
```

### 2. Adding the Modal

```jsx
import UnsavedChangesModal from "@/components/UnsavedChangesModal";

// Inside your component return
return (
  <div>
    {/* Your component content */}

    <UnsavedChangesModal
      isOpen={showModal}
      onContinue={continueEditing}
      onDiscard={discardChanges}
    />
  </div>
);
```

### 3. Tracking Unsaved Changes

Set the dirty state whenever the user makes a change:

```jsx
const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
  setIsDirty(true);
};

// Reset when saved
const handleSave = () => {
  // Save data
  setIsDirty(false);
};
```

### 4. Blocking Navigation

Use the `blockNavigation` function to check before performing navigation actions:

```jsx
const handleNavigate = () => {
  blockNavigation(() => {
    // Action to take if the user chooses to discard changes
    router.push("/some-page");
  });
};

// Example with tab change
const handleTabChange = (newTab) => {
  blockNavigation(() => {
    setActiveTab(newTab);
  });
};
```

## Handling Child-Parent Communication

When using nested components, pass the dirty state up to parent components:

```jsx
// In parent component
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

const handleUnsavedChangesUpdate = (isDirty) => {
  setHasUnsavedChanges(isDirty);
};

// In JSX
<ChildComponent onDirtyStateChange={handleUnsavedChangesUpdate} />;

// In child component
useEffect(() => {
  if (props.onDirtyStateChange) {
    props.onDirtyStateChange(isDirty);
  }
}, [isDirty, props.onDirtyStateChange]);
```

## Browser Window/Tab Close Protection

The hook automatically adds a listener for the browser's `beforeunload` event, which will prevent tab/window closing without confirmation when there are unsaved changes.

## Best Practices

1. Always reset the dirty state after saving changes
2. Use descriptive messages in your confirmation modals
3. Implement the warning at the appropriate level in your component hierarchy
4. Ensure all navigation paths are protected

By following these guidelines, you'll provide a consistent user experience and prevent accidental data loss in your application.
