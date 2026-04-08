import { PublicClientApplication } from "@azure/msal-browser";

/**
 * MSAL configuration for Microsoft Authentication.
 *
 * Required environment variables:
 *   REACT_APP_MSAL_CLIENT_ID   — Azure AD Application (client) ID
 *   REACT_APP_MSAL_TENANT_ID   — Azure AD Tenant ID, or "common" for multi-tenant
 *   REACT_APP_ONEDRIVE_FOLDER_ID — OneDrive folder item ID where files will be uploaded
 */
const msalConfig = {
    auth: {
        clientId: process.env.REACT_APP_MSAL_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.REACT_APP_MSAL_TENANT_ID || "common"}`,
        redirectUri: window.location.origin,
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
};

/**
 * Scopes required for Microsoft Graph API (OneDrive read/write and sharing).
 */
export const oneDriveScopes = [
    "Files.ReadWrite",
    "Files.ReadWrite.All",
];

export const msalInstance = new PublicClientApplication(msalConfig);
