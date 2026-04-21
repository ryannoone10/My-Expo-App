// Integration test - Applications list screen displays seeded data
// Adapted from Week 12 Tutorial: https://ucc.instructure.com/courses/86289/files
// https://github.com/rorypierce111/react-native-lab/blob/main/tests/StudentList.test.tsx
// help for mocking AsyncStorage: https://claude.ai/share/d31c6256-1c9d-4e5e-8fa7-8a99d8d516d2
import { render, waitFor } from '@testing-library/react-native';
import React from 'react';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-crypto', () => ({
  digestStringAsync: jest.fn().mockResolvedValue('mockedhash'),
  CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
}));

jest.mock('@/db/index', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: View };
});

import IndexScreen from '../app/(tabs)/index';
import { AppContext } from '../app/_layout';

const mockApplication = {
  id: 1,
  userID: 1,
  categoryID: 1,
  companyName: 'Test Company',
  position: 'Software Engineer',
  notes: null,
  metric: 1,
  appliedAt: Math.floor(Date.now() / 1000),
  createdAt: Math.floor(Date.now() / 1000),
};

const mockCategory = {
  id: 1,
  userID: 1,
  name: 'Tech',
  colour: '#007AFF',
  icon: 'laptop',
};

const mockStatusLog = {
  id: 1,
  applicationID: 1,
  oldStatus: -1,
  newStatus: 0,
  changedAt: Math.floor(Date.now() / 1000),
};

const mockContext = {
  applications: [mockApplication],
  setApplications: jest.fn(),
  categories: [mockCategory],
  setCategories: jest.fn(),
  statusLogs: [mockStatusLog],
  setStatusLogs: jest.fn(),
  currentUser: { id: 1, username: 'test', email: 'test@test.com', passwordHash: 'hash', createdAt: 1000 },
  setCurrentUser: jest.fn(),
  theme: {},
  isDark: false,
  toggleTheme: jest.fn(),
};

describe('IndexScreen', () => {
  it('renders the application and header', async () => {
    const { getByText } = render(
      <AppContext.Provider value={mockContext as any}>
        <IndexScreen />
      </AppContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('Test Company')).toBeTruthy();
      expect(getByText('My applications')).toBeTruthy();
    });
  });
});