import {fetchData, fixDate} from "./fetchData";

/**
 * Fetches a list of active fundraisers from the JustGiving API.
 * @returns All active fundraisers
 */
async function fetchFundraiserList(): Promise<JustGivingPagesData[]> {
    const url = "https://api.justgiving.com/b0e2e36e/v1/account/katy.horgan@gmail.com/pages";
    const data = await fetchData<JustGivingPagesData[]>(url);
    return data.filter((fr: JustGivingPagesData) => fr.pageStatus === "ACTIVE");
}

/**
 * Fetches the details of each fundraiser in a fundraiser list.
 * @returns The fundraiser details
 */
export async function fetchJustGivingFundraiserDetails(): Promise<FundraiserData[]> {
    const activeFundraisers = await fetchFundraiserList();
    const fundraiserUrl = "https://api.justgiving.com/b0e2e36e/v1/fundraising/pagebyid";

    return await Promise.all(activeFundraisers.map(async ({ pageId }) => {
        const url = `${fundraiserUrl}/${pageId}`;
        const data = await fetchData<any>(url);

        return {
            name: data.eventName,
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

