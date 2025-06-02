import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// These should be stored in environment variables
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

// Scopes for accessing Google Drive
const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata.readonly'
];

class GoogleDriveClient {
  private oauth2Client: OAuth2Client;
  private drive: any;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );

    this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
  }

  async authorize(token: string) {
    this.oauth2Client.setCredentials({ access_token: token });
  }

  async uploadFile(file: File, folderId?: string) {
    try {
      const fileMetadata = {
        name: file.name,
        parents: folderId ? [folderId] : undefined
      };

      const media = {
        mimeType: file.type,
        body: file
      };

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, name, webViewLink'
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async downloadFile(fileId: string) {
    try {
      const response = await this.drive.files.get({
        fileId: fileId,
        alt: 'media'
      }, {
        responseType: 'arraybuffer'
      });

      return response.data;
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  async listFiles(folderId?: string, pageSize = 10) {
    try {
      const query = folderId ? `'${folderId}' in parents` : undefined;
      
      const response = await this.drive.files.list({
        q: query,
        pageSize: pageSize,
        fields: 'files(id, name, mimeType, webViewLink, createdTime, modifiedTime)',
        orderBy: 'modifiedTime desc'
      });

      return response.data.files;
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  async createFolder(name: string, parentFolderId?: string) {
    try {
      const fileMetadata = {
        name: name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentFolderId ? [parentFolderId] : undefined
      };

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        fields: 'id, name, webViewLink'
      });

      return response.data;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  }

  async updatePermissions(fileId: string, emailAddress: string, role: 'reader' | 'writer' | 'owner') {
    try {
      const response = await this.drive.permissions.create({
        fileId: fileId,
        requestBody: {
          type: 'user',
          role: role,
          emailAddress: emailAddress
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error updating permissions:', error);
      throw error;
    }
  }
}

export const driveClient = new GoogleDriveClient();