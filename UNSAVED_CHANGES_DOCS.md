# Unsaved Changes Warning System

This document explains how to use the unsaved changes warning system in your application.

## Overview

The unsaved changes warning system shows a confirmation dialog when a user tries to navigate away from a page with unsaved changes. This helps prevent accidental data loss.

## Components

The system consists of three main parts:

1. **UnsavedChangesModal** - A modal dialog that asks the user if they want to leave without saving
2. **useUnsavedChangesWarning** - A hook for managing unsaved changes state and handling navigation
3. **NavigationLink** - A component for intercepting navigation with links

## Basic Usage

### 1. Import the hook and modal

```jsx
import React, { useState, useEffect } from "react";
import useUnsavedChangesWarning from "@/hooks/useUnsavedChangesWarning";
import UnsavedChangesModal from "@/components/UnsavedChangesModal";
```

### 2. Track unsaved changes in your component

```jsx
const YourComponent = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Get the hook functionality
  const {
    showWarningModal,
    handleNavigationAttempt,
    handleLeaveWithoutSaving,
    handleContinueEditing,
  } = useUnsavedChangesWarning(hasUnsavedChanges);

  // Set up the form
  const [formData, setFormData] = useState({ name: "" });

  // Track form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setHasUnsavedChanges(true);
  };

  // Handle form submission
  const handleSubmit = () => {
    // Save data
    setHasUnsavedChanges(false);
  };

  return (
    <>
      {/* The warning modal */}
      <UnsavedChangesModal
        isOpen={showWarningModal}
        onLeave={handleLeaveWithoutSaving}
        onCancel={handleContinueEditing}
      />

      {/* Your form */}
      <form onSubmit={handleSubmit}>
        <input name="name" value={formData.name} onChange={handleChange} />
        <button type="submit">Save</button>
      </form>

      {/* Navigation that checks for unsaved changes */}
      <button
        onClick={() =>
          handleNavigationAttempt(() => {
            // Navigation action to perform if user confirms leaving
            window.location.href = "/another-page";
          })
        }
      >
        Go to Another Page
      </button>
    </>
  );
};
```

## Handling Tab Changes

To detect when a user is trying to switch tabs or collapse a section:

```jsx
const ParentComponent = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("tab1");

  const { handleNavigationAttempt } =
    useUnsavedChangesWarning(hasUnsavedChanges);

  // Safely change tabs with unsaved changes warning
  const handleTabChange = (newTab) => {
    if (hasUnsavedChanges && newTab !== activeTab) {
      handleNavigationAttempt(() => {
        setActiveTab(newTab);
      });
    } else {
      setActiveTab(newTab);
    }
  };

  return (
    <>
      <Tabs
        tabs={["tab1", "tab2", "tab3"]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Content based on active tab */}
    </>
  );
};
```

## Best Practices

1. Reset `hasUnsavedChanges` to `false` after successfully saving data
2. Set `hasUnsavedChanges` to `true` on the first change to a form
3. Use `handleNavigationAttempt` for any action that would navigate away from unsaved changes
4. Include the `UnsavedChangesModal` in any component that tracks unsaved changes

By following these patterns, you can provide a consistent experience for users and prevent accidental data loss.
