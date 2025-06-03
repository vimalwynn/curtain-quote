import { useEffect, useState } from 'react';
import Button from './ui/Button';
import { driveClient } from '../utils/googleDrive';
import { useGoogleDrive } from '../hooks/useGoogleDrive';

export default function GoogleDriveAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { error } = useGoogleDrive();

  useEffect(() => {
    // Check if we have a token in localStorage
    const token = localStorage.getItem('googleDriveToken');
    if (token) {
      driveClient.authorize(token);
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuth = async () => {
    // This would typically redirect to Google's OAuth flow
    // For now, we'll just show an alert
    alert('Please implement OAuth flow with your Google Cloud credentials');
  };

  return (
    <div className="space-y-4">
      {!isAuthenticated ? (
        <Button onClick={handleAuth}>
          Connect to Google Drive
        </Button>
      ) : (
        <p className="text-sm text-green-600 dark:text-green-400">
          Connected to Google Drive
        </p>
      )}
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error.message}
        </p>
      )}
    </div>
  );
}