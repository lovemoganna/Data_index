import React from 'react';
import { TutorialView } from './TutorialView';

export const TestTutorial: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold p-4">Tutorial Test Page</h1>
      <TutorialView />
    </div>
  );
};
