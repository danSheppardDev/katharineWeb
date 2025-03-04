// Headers for all API calls
const headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
})

/**
 * Formats a JustGiving date response as a locale date string.
 * @param date The eventDate value from the JustGiving API
 * @returns The formatted date
 */
function fixDate(date: string): string {
    const match = date.match(/\/Date\((\d+)\)\//);
    return match ? new Date(Number(match[1])).toLocaleDateString("en-gb") : "N/A";
}

/**
 * Fetches a list of active fundraisers from the JustGiving API.
 * @returns All active fundraisers
 */
async function fetchFundraiserList(): Promise<JustGivingPagesData[]> {
    const response = await fetch("https://api.justgiving.com/b0e2e36e/v1/account/katy.horgan@gmail.com/pages", {
        headers
    });

    if (!response.ok) throw new Error('An error occurred: ' + response.statusText);

    // Explicitly type the response to JustGivingAccountData[]
    const data = await response.json() as JustGivingPagesData[];
    return data.filter((fr) => fr.pageStatus === "ACTIVE");
}

/**
 * Fetches the details of each fundraiser in a fundraiser list.
 * @returns The fundraiser details
 */
export async function fetchFundraiserDetails(): Promise<FundraiserDetails[]> {
    const activeFundraisers = await fetchFundraiserList();
    const fundraiserUrl = "https://api.justgiving.com/b0e2e36e/v1/fundraising/pagebyid";

    // Using Promise.all to fetch data concurrently
    return await Promise.all(activeFundraisers.map(async ({pageId}) => {
        const response = await fetch(`${fundraiserUrl}/${pageId}`, {
            headers
        });

        if (!response.ok) throw new Error('An error occurred: ' + response.statusText);

        const data = await response.json() as JustGivingFundraiserData;

        return {
            eventName: data.eventName,
            eventDate: fixDate(data.eventDate),
            fundraisingTarget: `${data.fundraisingTarget}`,
            totalRaised: `${data.grandTotalRaisedExcludingGiftAid}`,
            url: `https://justgiving.com/${data.pageShortName}`,
            totalRaisedPercentageOfFundraisingTarget: data.totalRaisedPercentageOfFundraisingTarget,
            charityName: data.charity.name,
            charityUrl: data.charity.profilePageUrl,
        } as FundraiserDetails;
    }));
}
