# App Version Manager

A React application for managing mobile app versions across different applications with different base URLs.

## Features

- **Multi-App Support**: Switch between different apps (Employee, Student, Teacher, Parent)
- **Dynamic Base URLs**: Each app has its own API endpoint
- **Version Management**: List and add/update app versions
- **Platform Support**: Handle both iOS and Android versions
- **School Management**: Add and manage custom school API URLs
- **☁️ Cloud Sync**: Sync custom schools across devices (NEW!)
- **Multi-Language**: Support for Arabic and English with RTL
- **Clean UI**: Modern card-based design with smooth animations

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- (Optional) Firebase account for cloud sync

### Installation

1. Install dependencies:

```bash
npm install
```

2. **(Optional) Setup Firebase for Cloud Sync:**

   Follow the detailed guide: [Firebase Setup Guide](./FIREBASE_SETUP_GUIDE.md)

3. Start the development server:

```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage

### School Management

#### Add Custom School
1. Click the purple "Add School" button
2. Enter school name and API URLs
3. Click "Add School" to save

#### Delete Custom School
1. Click the green "View Schools" button
2. Find the school you want to delete
3. Click the red "Delete" button
4. Confirm deletion

#### Cloud Sync (Cross-Device Access)
1. Setup Firebase (see [Firebase Setup Guide](./FIREBASE_SETUP_GUIDE.md))
2. Toggle "Enable Cloud Sync" to ON
3. Click "Upload to Cloud" to save schools
4. Open app on another device
5. Toggle ON and click "Download from Cloud"
6. Your schools are now synced!

For detailed cloud sync instructions: [Cloud Sync User Guide](./CLOUD_SYNC_USER_GUIDE.md)

### Configuration

1. Select an application from the dropdown (Employee, Student, Teacher, or Parent)
2. The base URL will automatically update based on your selection

### List Versions

1. Go to the "List Versions" tab
2. Select the platform (iOS or Android)
3. Click "Refresh Data" to fetch current versions

### Add/Update Versions

1. Go to the "Add/Update Version" tab
2. Fill in the version details:
   - Version number (e.g., 1.0.0)
   - Platform (iOS or Android)
   - Status (Active or Inactive)
3. Click "Save Version"

## API Integration

The app integrates with the following API endpoints:

### GET Request (List Versions)

```
GET {baseUrl}/mobile-versions/{platform}/{app_name}
```

### POST Request (Add/Update Version)

```
POST {baseUrl}/add-update-mobile-version
Content-Type: application/vnd.api+json

{
  "data": {
    "type": "user",
    "id": "null",
    "attributes": {
      "app_name": "employee",
      "version": "1.0.0",
      "is_active": true,
      "type": "ios"
    }
  }
}
```

## App Configurations

The application supports multiple apps with different base URLs:

- **Employee App**: `https://api.dar-al-ahfad.ouredu.net/api/v1/ar`
- **Student App**: `https://api-student.dar-al-ahfad.ouredu.net/api/v1/ar`
- **Teacher App**: `https://api-teacher.dar-al-ahfad.ouredu.net/api/v1/ar`
- **Parent App**: `https://api-parent.dar-al-ahfad.ouredu.net/api/v1/ar`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/
│   ├── AppSelector.js      # App selection dropdown
│   ├── VersionList.js      # Display versions list
│   └── VersionForm.js      # Add/update version form
├── App.js                  # Main application component
├── index.js               # Application entry point
└── index.css              # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
