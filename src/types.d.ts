/**
 * The final shape of fundraiser data for all sources
 */
interface FundraiserDetails {
    eventName: string;
    fundraisingTarget: string;
    totalRaised: string;
    url: string;
    eventDate: string;
    totalRaisedPercentageOfFundraisingTarget: number | string;
    charityName: string;
    charityUrl: string;
}

/**
 * The required data in a JustGiving page request
 */
interface JustGivingPagesData {
    pageStatus: string;
    pageId: string;
    raisedAmount: number;
    targetAmount: number;
}

/**
 * The required data in a JustGiving fundraiser request
 */
interface JustGivingFundraiserData {
    eventName: string;
    eventDate: string;
    fundraisingTarget: number;
    grandTotalRaisedExcludingGiftAid: number;
    totalRaisedPercentageOfFundraisingTarget: number;
    pageShortName: string;
    charity: {
        name: string;
        profilePageUrl: string;
    }
}