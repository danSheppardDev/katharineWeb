import React, { ReactElement } from "react";

/**
 * Adds a currency symbol to a currency string.
 * Returns "N/A" if no valid currency is found.
 * @param value - the currency string to be converted
 * @returns The formatted string
 */
export const formatCurrency = (value: number): string => value ? `£${value.toString()}` : "N/A";

/**
 * Checks to see if a value contains a URL and formats the output accordingly.
 * Returns "N/A" if no valid URL was found,
 * @param url - the target URL
 * @param text - the text to be displayed in the link
 * @returns the resulting string
 */
export const formatLink = (url: string, text: string): ReactElement =>
    url ? <a href={url} target="_blank" rel="noopener noreferrer">{text}</a> : <>{text}</>;

// Helper to format date in 'en-gb' locale
export const formatDate = (date: Date) => new Date(date).toLocaleDateString("en-gb");

// Helper to format total raised or target status
export const getTotalRaisedOrStatus = (progressPercentage: number, totalRaised: number) => {
    return progressPercentage === 100 ? "Target hit" : formatCurrency(totalRaised);
};