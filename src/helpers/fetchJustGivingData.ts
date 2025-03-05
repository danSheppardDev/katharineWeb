// Headers for all API calls
const headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
});

/**
 * Utility function to handle fetch requests and errors
 * @param url The URL to fetch from
 * @param options The fetch options
 * @returns Parsed JSON data from the response
 */
async function fetchData<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) throw new Error('An error occurred: ' + response.statusText);
    return response.json();
}

/**
 * Fetches a list of active fundraisers from the JustGiving API.
 * @returns All active fundraisers
 */
async function fetchFundraiserList(): Promise<JustGivingPagesData[]> {
    const url = "https://api.justgiving.com/b0e2e36e/v1/account/katy.horgan@gmail.com/pages";
    const data = await fetchData<JustGivingPagesData[]>(url);
    return data.filter((fr) => fr.pageStatus === "ACTIVE");
}

/**
 * Fetches the details of each fundraiser in a fundraiser list.
 * @returns The fundraiser details
 */
export async function fetchFundraiserDetails(): Promise<FundraiserData[]> {
    const activeFundraisers = await fetchFundraiserList();
    const fundraiserUrl = "https://api.justgiving.com/b0e2e36e/v1/fundraising/pagebyid";

    // Using Promise.all to fetch data concurrently
    return await Promise.all(activeFundraisers.map(async ({ pageId }) => {
        const url = `${fundraiserUrl}/${pageId}`;
        const data = await fetchData<any>(url);

        return {
            name: data.title,
            date: fixDate(data.eventDate),
            url: `https://justgiving.com/${data.pageShortName}`,
            charityName: data.charity.name,
            charityUrl: data.charity.profilePageUrl,
            fundraisingTarget: Number(data.fundraisingTarget),
            totalRaised: Number(data.grandTotalRaisedExcludingGiftAid),
            progressPercentage: Number(data.totalRaisedPercentageOfFundraisingTarget),
        } as FundraiserData;
    }));
}

/**
 * Formats a JustGiving date response as a locale date string.
 * @param date The eventDate value from the JustGiving API
 * @returns The formatted date
 */
const fixDate = (date: string): Date => {
    const match = date.match(/\/Date\((\d+)\)\//);
    return match ? new Date(Number(match[1])) : new Date("N/A");
};
