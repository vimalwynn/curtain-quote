import { driveClient } from './googleDrive';

async function testGoogleDriveAPI() {
  try {
    console.log('🔍 Testing Google Drive API integration...');

    // Test 1: Authentication
    console.log('\n📝 Test 1: Authentication');
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      throw new Error('Missing required Google API credentials');
    }
    console.log('✅ Credentials found');

    // Test 2: List Files
    console.log('\n📝 Test 2: Listing Files');
    const files = await driveClient.listFiles(undefined, 5);
    console.log(`✅ Successfully listed ${files.length} files`);
    files.forEach(file => {
      console.log(`  - ${file.name} (${file.id})`);
    });

    // Test 3: Create Folder
    console.log('\n📝 Test 3: Creating Test Folder');
    const folder = await driveClient.createFolder('API Test Folder');
    console.log('✅ Successfully created folder:', folder.name);

    // Test 4: Upload File
    console.log('\n📝 Test 4: Uploading Test File');
    const testFile = new File(['Test content'], 'test.txt', { type: 'text/plain' });
    const uploadedFile = await driveClient.uploadFile(testFile, folder.id);
    console.log('✅ Successfully uploaded file:', uploadedFile.name);

    // Test 5: Update Permissions
    console.log('\n📝 Test 5: Updating Permissions');
    await driveClient.updatePermissions(uploadedFile.id, 'test@example.com', 'reader');
    console.log('✅ Successfully updated permissions');

    console.log('\n✨ All tests completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    throw error;
  }
}

export { testGoogleDriveAPI };