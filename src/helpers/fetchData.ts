// Headers for all API calls
const defaultHeaders = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
});

/**
 * Utility function to handle fetch requests and errors
 * @param url The URL to fetch from
 * @param options The fetch options
 * @param clean Whether the response needs to be cleaned (default: false)
 * @returns The parsed JSON data from the response
 */
export async function fetchData<T>(url: string, options: RequestInit = {}, clean: boolean = false): Promise<T> {
    const response = await fetch(url, { ...options, headers: options.headers ? options.headers : defaultHeaders });
    if (!response.ok) throw new Error('An error occurred: ' + response.statusText);

    const text = await response.text();

    /**
     * Clean up Google Sheets response data
     */
    if (clean) {
        const cleanedText = text
            .replace("/*O_o*/", "")
            .replace("google.visualization.Query.setResponse(", "")
            .slice(0, -2);

        try {
            return JSON.parse(cleanedText);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            throw new Error("Failed to parse the data from Google Sheets API response.");
        }
    } else {
        try {
            return JSON.parse(text);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            throw new Error("Failed to parse the data.");
        }
    }
}

/**
 * Formats a date response as a locale date string.
 * @param date The eventDate value from the JustGiving API
 * @returns The formatted date
 */
export const fixDate = (date: string): Date => {
    const match = date.match(/\/Date\((\d+)\)\//);
    return match ? new Date(Number(match[1])) : new Date("N/A");
};