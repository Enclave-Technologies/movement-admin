"use client";
import React from 'react';
import TestUnsavedChanges from '@/components/TestUnsavedChanges';

/**
 * A test page for testing unsaved changes warnings
 */
export default function TestUnsavedChangesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Unsaved Changes Test Page</h1>
      <p className="mb-6 text-gray-600">
        This page helps debug issues with unsaved changes warnings.
        Try checking the box and clicking test buttons or navigating away.
      </p>
      
      <TestUnsavedChanges />
    </div>
  );
} 