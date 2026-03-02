import React, {useMemo} from "react";
import {formatCurrency, formatLink, formatDate, getTotalRaisedOrStatus} from "../helpers/Formatting";

interface TableProps {
    fundraisers: FundraiserData[];
    total: number;
    totalRaised: number;
}

/**
 * Renders a table containing fundraiser data
 * @param fundraisers The fundraiser data array fetched from the API and data file
 * @param total The total target amount
 * @param totalRaised The total amount of money raised
 * @constructor
 */
export const Table = ({ fundraisers, total, totalRaised }: TableProps) => {
    // only show events on or after today (start of day)
    const cutoff = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);
    const visibleFundraisers = useMemo(() => {
        return fundraisers.filter(f => {
            const d = new Date(f.date);
            return !isNaN(d.getTime()) && d >= cutoff;
        });
    }, [fundraisers, cutoff]);

    const fundraisingProgress = useMemo(() => {
        return visibleFundraisers.map(f => {
            const { totalRaised, fundraisingTarget } = f;
            if (!totalRaised || !fundraisingTarget) return 0;
            return Math.floor((totalRaised / fundraisingTarget) * 100);
        });
    }, [visibleFundraisers]);

    return (
        <div className="table-container">
            <style>
                {`@media (max-width: 768px) {
                    /* remove horizontal scrolling and treat each row as a block */
                    .table-container {
                        overflow-x: visible !important;
                        padding: 0 0.5rem;
                    }
                    .table-container table {
                        display: block;
                        width: 100%;
                        margin: 0 !important;
                    }
                    .table-container thead {
                        display: none;
                    }
                    .table-container tr {
                        display: block;
                        margin-bottom: 0.75rem;
                        border-bottom: 1px solid #ddd;
                        padding: 0.75rem 1rem;
                    }
                    .table-container tr:last-child {
                        background-color: #f5f5f5;
                        border-radius: 4px;
                        margin-top: 1rem;
                    }
                    .table-container td {
                        display: block;
                        text-align: left;
                        padding: 0.25rem 0;
                        white-space: normal;
                        word-break: break-word;
                    }
                    .table-container td:before {
                        /* label appears above value */
                        content: attr(data-label) ": ";
                        display: block;
                        font-weight: bold;
                        margin-bottom: 0.25rem;
                    }
                    /* hide label for totals row */
                    .table-container tr:last-child td:before {
                        display: none;
                    }
                    .table-container tr:last-child td {
                        padding: 0.5rem 0;
                        font-weight: 600;
                    }
                }`}
            </style>
            <table className="table is-fullwidth is-narrow is-bordered is-striped is-hoverable mx-auto">
                <thead>
                <tr>
                    <th scope={"col"}>Dates</th>
                    <th scope={"col"}>Race</th>
                    <th scope={"col"}>Charity</th>
                    <th scope={"col"}>Link</th>
                    <th scope={"col"}>Goal</th>
                    <th scope={"col"}>Total Raised</th>
                </tr>
                </thead>
                <tbody>
                {visibleFundraisers.map((f, index) => {
                    const { date, name, charityName, url = "", fundraisingTarget, totalRaised } = f;
                    const progress = fundraisingProgress[index];
                    return (
                        <tr key={index}>
                            <td data-label="Dates" className="has-text-centered">{formatDate(date)}</td>
                            <td data-label="Race" className="has-text-centered">{name}</td>
                            <td data-label="Charity" className="has-text-centered">{charityName}</td>
                            <td data-label="Link" className="has-text-centered">{formatLink(url, "Click here", true)}</td>
                            <td data-label="Goal" className="has-text-centered">{formatCurrency(fundraisingTarget)}</td>
                            <td data-label="Total Raised" className="has-text-centered">{getTotalRaisedOrStatus(progress, totalRaised)}</td>
                        </tr>
                    );
                })}
                <tr>
                    <td className="has-text-centered" colSpan={4}>
                        <strong>Total</strong>
                    </td>
                    <td className={"has-text-centered"}>{formatCurrency(total)}</td>
                    <td className={"has-text-centered"}>{formatCurrency(totalRaised)}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};
