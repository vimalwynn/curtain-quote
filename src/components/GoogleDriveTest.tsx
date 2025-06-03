import { useState } from 'react';
import { testGoogleDriveAPI } from '../utils/testGoogleDrive';
import Button from './ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';

export default function GoogleDriveTest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTests = async () => {
    setIsLoading(true);
    setError(null);
    setTestResults([]);

    try {
      const consoleLog = console.log;
      const logs: string[] = [];

      // Override console.log to capture output
      console.log = (...args) => {
        logs.push(args.join(' '));
        consoleLog.apply(console, args);
      };

      await testGoogleDriveAPI();
      setTestResults(logs);

      // Restore console.log
      console.log = consoleLog;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Drive API Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            onClick={runTests}
            isLoading={isLoading}
          >
            Run API Tests
          </Button>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md">
              {error}
            </div>
          )}

          {testResults.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {testResults.join('\n')}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}