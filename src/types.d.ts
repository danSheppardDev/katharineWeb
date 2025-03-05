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
 * The required data in a fundraiser request
 */
type FundraiserData = {
    name: string;
    date: Date;
    fundraisingTarget: number;
    totalRaised: number;
    progressPercentage?: number;
    url?: string;
    charityName: string
    charityUrl: string
}