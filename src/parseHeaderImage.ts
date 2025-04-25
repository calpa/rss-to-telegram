/**
 * Converts a header image URL to a specified file type and updates the URL path.
 * @param {string} headerImage - The original header image URL.
 * @param {string} [filetype='.png'] - The desired file type extension.
 * @returns {string} - The converted header image URL.
 */
export function convertHeaderImage(headerImage: string, filetype: string = '.png'): string {
    return headerImage.replace('.avif', filetype).replace('assets.calpa.me', 'assets.calpa.me/telegram');
}