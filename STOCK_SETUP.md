# Stock Page Setup Guide

This guide walks you through setting up the Azure App Registration so the `/stock` page can read your OneDrive Excel file.

## Step 1 — Register the app in Azure

1. Open your browser and go to [https://portal.azure.com](https://portal.azure.com).
2. Sign in with your Microsoft account (the same one that has the OneDrive file).
3. In the search bar at the top, type **App registrations** and click on it.
4. Click **New registration** (top-left button).

## Step 2 — Fill in the registration form

- **Name:** `Pllum Legno Stock`
- **Supported account types:** Choose **"Accounts in any organizational directory (Any Microsoft Entra ID tenant) and personal Microsoft accounts (e.g. Skype, Xbox)"** — or if the file is only on a personal OneDrive, choose **"Personal Microsoft accounts only"**.
- **Redirect URI:** Select **Web** from the drop-down, then enter:
  ```
  http://localhost:3000/api/auth/callback/azure-ad
  ```
- Click **Register**.

## Step 3 — Copy your Client ID

After registration, you will land on the app overview page.

- Find **Application (client) ID** and copy it.
- Open `.env.local` in this project and replace `your-azure-client-id` with the value you copied.

## Step 4 — Create a Client Secret

1. In the left sidebar of your app registration, click **Certificates & secrets**.
2. Click **New client secret**.
3. Give it a description (e.g. `Stock page`) and choose an expiry (e.g. 24 months).
4. Click **Add**.
5. **Copy the Value** immediately — you will not be able to see it again after you navigate away.
6. In `.env.local`, replace `your-azure-client-secret` with this value.

## Step 5 — Add API Permissions

1. In the left sidebar, click **API permissions**.
2. Click **Add a permission**.
3. Select **Microsoft Graph**.
4. Select **Delegated permissions**.
5. Search for and add both of these:
   - `Files.Read`
   - `User.Read`
6. Click **Add permissions**.
7. Click **Grant admin consent for [your tenant]** (the blue button). Click **Yes** to confirm.

## Step 6 — Point to your Excel file

1. Upload your stock Excel file to your OneDrive if it isn't there already.
2. In `.env.local`, set `ONEDRIVE_FILE_PATH` to the filename (or path) of the file relative to your OneDrive root. For example:
   ```
   ONEDRIVE_FILE_PATH=Stock Report.xlsx
   ```
   If it is inside a folder:
   ```
   ONEDRIVE_FILE_PATH=Reports/Stock Report.xlsx
   ```

## Step 7 — Generate a NextAuth secret

In a terminal, run:
```bash
npx auth secret
```
Copy the output and replace `your-secret-here` in `.env.local`.

## Step 8 — Start the app

```bash
npm run dev
```

Visit [http://localhost:3000/stock](http://localhost:3000/stock). You will be redirected to sign in with Microsoft. After signing in, the stock page will load your Excel data and show items with fewer than 10 units in hand.

## Excel file column requirements

The first row of **Sheet1** must contain these exact column headers (spelling and capitalisation matter):

| Column header |
|---|
| Product Name And Style |
| Size |
| Grain Style |
| Group |
| Item Code and Group |
| Qty In Hand |

The page shows all rows where **Qty In Hand** is less than 10. Rows with fewer than 5 are highlighted red; rows with 5–9 are highlighted orange.
