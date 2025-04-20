# Mobile Layout Plan for CompactTableOps Component

This document outlines several possible mobile layout options for the `CompactTableOps` component, which currently is not suitable for mobile view. The component is a toolbar with search, filter, sort, and action buttons.

## Overview

The current layout is a horizontal toolbar with multiple buttons and inputs. On mobile devices, horizontal space is limited, so the layout needs to be adapted for usability and accessibility.

## Mobile Layout Options

### 1. Vertical Stack Layout

-   Stack all toolbar elements vertically.
-   Inputs and buttons take full width.
-   Simple and straightforward.
-   Use Tailwind classes like `flex-col`, `w-full`, `space-y-2`.
-   **Pros:** Easy to implement, good for narrow screens.
-   **Cons:** Takes more vertical space.

### 2. Collapsible Sections

-   Show minimal toolbar with icons or summary badges.
-   Expandable/collapsible sections for search, filter, and sort.
-   Saves vertical space by hiding controls until needed.
-   Use Tailwind `hidden`, `block`, and state toggles.
-   **Pros:** Compact, user controls visibility.
-   **Cons:** More interaction required.

### 3. Icon Popovers

-   Replace text buttons with icons.
-   Use popovers or dropdown menus for filter and sort controls.
-   Toolbar remains horizontal but compact.
-   **Pros:** Saves space, familiar UI pattern.
-   **Cons:** May be less discoverable for some users.

### 4. Bottom Sheet / Drawer

-   Keep toolbar minimal with search and main actions.
-   Move filters and sort controls to a bottom sheet or drawer.
-   User opens sheet/drawer to access advanced controls.
-   **Pros:** Clean main UI, advanced controls accessible.
-   **Cons:** Requires additional UI components.

## Visual Diagram

```mermaid
flowchart TD
    A[CompactTableOps Toolbar] --> B1[Option 1: Vertical Stack]
    A --> B2[Option 2: Collapsible Sections]
    A --> B3[Option 3: Icon Popovers]
    A --> B4[Option 4: Bottom Sheet / Drawer]

    B1 --> C1[Stack search input, filter, sort, buttons vertically]
    B1 --> C2[Full width inputs and buttons]
    B1 --> C3[Use Tailwind responsive classes: flex-col, w-full]

    B2 --> D1[Show only icons or minimal toolbar initially]
    B2 --> D2[Expandable sections for search, filter, sort]
    B2 --> D3[Use Tailwind hidden/block with breakpoints]

    B3 --> E1[Replace text buttons with icons]
    E1 --> E2[Use popovers/dropdowns for filter and sort controls]
    E1 --> E3[Compact toolbar with minimal width]

    B4 --> F1[Hide filters and sort in bottom sheet or drawer]
    F1 --> F2[Toolbar shows only search and main actions]
    F1 --> F3[User taps button to open bottom sheet for advanced options]
```

---

This plan provides a clear set of options to improve the mobile usability of the `CompactTableOps` component using Tailwind CSS.

You can refer to this document for implementation or further discussion.
