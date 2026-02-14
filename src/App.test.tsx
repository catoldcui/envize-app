import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { useEnvize } from './hooks/useEnvize';

// Mock the useEnvize hook
vi.mock('./hooks/useEnvize', () => ({
  useEnvize: vi.fn(),
}));

describe('App - Copy Profile', () => {
  const mockProfiles = [
    {
      name: 'test-profile',
      path: '/path/to/test-profile.env',
      isLocal: false,
      description: 'Test profile description',
      tags: ['test', 'dev'],
      variableCount: 2,
    },
    {
      name: 'another-profile',
      path: '/path/to/another-profile.env',
      isLocal: false,
      description: 'Another profile',
      tags: ['prod'],
      variableCount: 1,
    },
  ];

  const mockProfileContent = '# @description: Test profile description\n# @tags: test, dev\n\nKEY1=value1\nKEY2=value2\n';

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
  });

  it('should copy a profile with all its content', async () => {
    // Create a mutable profiles array for the mock
    const profiles = [...mockProfiles];
    
    // Mock the envize object
    const mockEnvize = {
      profiles,
      status: { active_profiles: [], variables: {}, applied_at: '' },
      templates: [],
      loading: false,
      error: null,
      setError: vi.fn(),
      setStatus: vi.fn(),
      refresh: vi.fn().mockImplementation(() => {
        // Simulate that the new profile is added after refresh
        if (!profiles.some(p => p.name === 'test-profile-copy')) {
          profiles.push({
            name: 'test-profile-copy',
            path: '/path/to/test-profile-copy.env',
            isLocal: false,
            description: '',
            tags: [],
            variableCount: 0,
          });
        }
      }),
      fetchTemplates: vi.fn(),
      activateProfiles: vi.fn(),
      addProfile: vi.fn(),
      unuseProfile: vi.fn(),
      createProfile: vi.fn(),
      deleteProfile: vi.fn(),
      readProfileContent: vi.fn().mockResolvedValue(mockProfileContent),
      writeProfileContent: vi.fn(),
    };
    
    (useEnvize as any).mockReturnValue(mockEnvize);

    render(<App />);
    
    // Select the profile first
    const profileButton = screen.getByText('test-profile');
    fireEvent.click(profileButton);
    
    // Find and click the copy button
    const copyButton = screen.getByLabelText('Duplicate profile');
    fireEvent.click(copyButton);
    
    // Wait for the operations to complete
    await waitFor(() => {
      expect(mockEnvize.createProfile).toHaveBeenCalledWith('test-profile-copy');
      expect(mockEnvize.readProfileContent).toHaveBeenCalledWith('/path/to/test-profile.env');
      expect(mockEnvize.refresh).toHaveBeenCalled();
    });
    
    // Verify that writeProfileContent was called with the correct content
    expect(mockEnvize.writeProfileContent).toHaveBeenCalledWith(
      '/path/to/test-profile-copy.env',
      mockProfileContent
    );
  });
});