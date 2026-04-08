import { msalInstance, oneDriveScopes } from "./OneDriveConfig";

const GRAPH_API = "https://graph.microsoft.com/v1.0";

/**
 * Acquires a Microsoft Graph access token silently, or via popup if needed.
 * @returns {Promise<string>} Access token
 */
async function getAccessToken() {
    await msalInstance.initialize();

    const accounts = msalInstance.getAllAccounts();
    const request = {
        scopes: oneDriveScopes,
        ...(accounts.length > 0 && { account: accounts[0] }),
    };

    if (accounts.length > 0) {
        try {
            const result = await msalInstance.acquireTokenSilent(request);
            return result.accessToken;
        } catch {
            // Fall through to popup if silent fails
        }
    }

    const result = await msalInstance.acquireTokenPopup({ scopes: oneDriveScopes });
    return result.accessToken;
}

/**
 * Converts a OneDrive sharing URL to a permanent CDN-accessible media URL.
 *
 * This mirrors Google Drive's `?alt=media` approach: the resulting URL
 * points directly to the file content via the Microsoft Graph shares API.
 *
 * @param {string} shareUrl - The sharing URL returned by createLink (webUrl)
 * @returns {string} Direct CDN media URL
 */
export function convertToCDNUrl(shareUrl) {
    // Base64url-encode the sharing URL (strip padding, URL-safe chars)
    const encoded = btoa(shareUrl)
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
    return `${GRAPH_API}/shares/u!${encoded}/driveItem/content`;
}

/**
 * Uploads a single file to a OneDrive folder and returns a permanent CDN URL.
 *
 * Steps:
 *  1. Upload file bytes to the target folder via Graph API.
 *  2. Create an anonymous view sharing link.
 *  3. Convert the sharing URL to a CDN media URL using convertToCDNUrl().
 *
 * @param {File} file - The File object to upload
 * @param {string} [folderId="root"] - OneDrive folder item ID (from env var or default "root")
 * @returns {Promise<string>} CDN URL for the uploaded file
 */
export async function uploadFileToOneDrive(file, folderId) {
    const token = await getAccessToken();
    const folder = folderId || process.env.REACT_APP_ONEDRIVE_FOLDER_ID || "root";

    // 1. Upload file content (simple upload ≤ 4 MB; large files use upload session)
    const uploadUrl =
        folder === "root"
            ? `${GRAPH_API}/me/drive/root:/${encodeURIComponent(file.name)}:/content`
            : `${GRAPH_API}/me/drive/items/${folder}:/${encodeURIComponent(file.name)}:/content`;

    const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
    });

    if (!uploadResponse.ok) {
        const err = await uploadResponse.text();
        throw new Error(`OneDrive upload failed: ${err}`);
    }

    const uploadedItem = await uploadResponse.json();
    const itemId = uploadedItem.id;

    // 2. Create an anonymous view sharing link
    const shareResponse = await fetch(
        `${GRAPH_API}/me/drive/items/${itemId}/createLink`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ type: "view", scope: "anonymous" }),
        }
    );

    if (!shareResponse.ok) {
        const err = await shareResponse.text();
        throw new Error(`OneDrive createLink failed: ${err}`);
    }

    const shareData = await shareResponse.json();
    const shareUrl = shareData.link?.webUrl;

    if (!shareUrl) {
        throw new Error("OneDrive did not return a sharing URL.");
    }

    // 3. Convert to CDN media URL (analogous to Google Drive's alt=media)
    return convertToCDNUrl(shareUrl);
}

/**
 * Uploads multiple files to OneDrive in the same folder and returns
 * an array of CDN URLs.
 *
 * @param {File[]} files
 * @param {string} [folderId] - OneDrive folder ID
 * @returns {Promise<string[]>}
 */
export async function uploadFilesToOneDrive(files, folderId) {
    return Promise.all(files.map((file) => uploadFileToOneDrive(file, folderId)));
}
