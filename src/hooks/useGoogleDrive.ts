import { useState, useCallback } from 'react';
import { driveClient } from '../utils/googleDrive';

export function useGoogleDrive() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadFile = useCallback(async (file: File, folderId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await driveClient.uploadFile(file, folderId);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const downloadFile = useCallback(async (fileId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await driveClient.downloadFile(fileId);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const listFiles = useCallback(async (folderId?: string, pageSize?: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await driveClient.listFiles(folderId, pageSize);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createFolder = useCallback(async (name: string, parentFolderId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await driveClient.createFolder(name, parentFolderId);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePermissions = useCallback(async (fileId: string, emailAddress: string, role: 'reader' | 'writer' | 'owner') => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await driveClient.updatePermissions(fileId, emailAddress, role);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    uploadFile,
    downloadFile,
    listFiles,
    createFolder,
    updatePermissions,
    isLoading,
    error
  };
}