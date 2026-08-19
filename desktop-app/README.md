# Medicine Details Manager — Windows Desktop

This folder is a separate desktop version of the existing web app. The existing root web-app files are not changed.

## What it does

- Runs as a Windows desktop application.
- Provides a login for each user.
- Users can enter medicine, vaccination, or disinfect records.
- **Save Record** writes the complete record to the local computer.
- On Windows, all application data is stored under `C:\medicine data`.
- Each saved record is stored as a JSON file in `C:\medicine data\records`.
- User accounts are stored in `C:\medicine data\users.json`.
- A superuser/admin can see all users' saved records, create users, reset passwords, and delete records.
- Normal users only see their own saved records.
- Printing remains available.

## First Windows launch

On the first launch, the app creates `C:\medicine data` and writes a generated administrator password to:

`C:\medicine data\FIRST_LOGIN.txt`

Use username `admin` and that temporary password to sign in. The current implementation supports resetting user passwords from the admin screen.

## Build on GitHub

A GitHub Actions workflow is included at `.github/workflows/build-windows-desktop.yml`. It builds a Windows NSIS installer and portable executable on a Windows runner, so a Mac can be used to develop and push the project without needing to build the `.exe` locally.

## Local development

From this folder:

```bash
npm install
npm start
```

To build Windows packages on a Windows machine:

```bash
npm run dist:win
```
