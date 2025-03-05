import React, { ReactElement } from "react";

/**
 * Adds a currency symbol to a currency string.
 * Returns "N/A" if no valid currency is found.
 * @param value - the currency string to be converted
 * @returns The formatted string
 */
export const formatCurrency = (value: number): string => value ? `£${value.toString()}` : "N/A";

/**
 * Formats a link or text based on the presence of a URL and the `blank` flag.
 * @param url - the target URL
 * @param text - the text to be displayed in the link
 * @param blank - whether empty values should be blank or not
 * @returns the resulting string or JSX element
 */
export const formatLink = (url: string, text: string, blank: boolean): ReactElement =>
    url
        ? <a href={url} target="_blank" rel="noopener noreferrer">{blank && !url ? "" : text}</a>
        : blank ? <></> : <>{text}</>;

// Helper to format date in 'en-gb' locale
export const formatDate = (date: Date) => new Date(date).toLocaleDateString("en-gb");

// Helper to format total raised or target status
export const getTotalRaisedOrStatus = (progressPercentage: number, totalRaised: number) => {
    return progressPercentage === 100 ? "Target hit" : formatCurrency(totalRaised);
};