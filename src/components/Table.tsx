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
        <div className="table-container mobile-table-wrap">
            <style>
                {`@media (max-width: 768px) {
                    /* remove horizontal scrolling and treat each row as a block */
                    .mobile-table-wrap {
                        display: flex;
                        justify-content: center;
                        overflow-x: visible !important;
                        padding: 0;
                        text-align: center;
                    }
                    .mobile-table-wrap table {
                        display: block;
                        width: 100%;
                        max-width: 360px;
                        margin: 0 auto !important;
                    }
                    .mobile-table-wrap thead {
                        display: none;
                    }
                    .mobile-table-wrap tbody {
                        display: block;
                        width: 100%;
                    }
                    .mobile-table-wrap tr {
                        display: block;
                        width: 100%;
                        margin: 0 auto 0.75rem;
                        border-bottom: 1px solid #ddd;
                        padding: 0.75rem 1rem;
                        box-sizing: border-box;
                    }
                    .mobile-table-wrap td {
                        display: block;
                        text-align: center;
                        padding: 0.25rem 0;
                        white-space: normal;
                        word-break: break-word;
                    }
                    .mobile-table-wrap td[data-label]:before {
                        content: attr(data-label) ": ";
                        display: block;
                        font-weight: bold;
                        margin-bottom: 0.25rem;
                        text-align: center;
                    }

                    .mobile-table-wrap .totals-row {
                        margin-top: 1rem;
                        border-radius: 4px;
                        border-bottom: none;
                        background-color: #ffffff !important;
                        -webkit-tap-highlight-color: transparent;
                    }
                    .mobile-table-wrap .totals-row,
                    .mobile-table-wrap .totals-row * {
                        -webkit-tap-highlight-color: transparent !important;
                    }
                    .mobile-table-wrap .totals-row td,
                    .mobile-table-wrap .totals-row:hover td,
                    .mobile-table-wrap .totals-row:active td,
                    .mobile-table-wrap .totals-row:focus td,
                    .mobile-table-wrap .totals-row td:hover,
                    .mobile-table-wrap .totals-row td:active,
                    .mobile-table-wrap .totals-row td:focus,
                    .mobile-table-wrap .totals-row td:focus-visible {
                        background-color: #ffffff !important;
                        padding: 0.5rem 0;
                        font-weight: 600;
                    }

                    .mobile-table-wrap .totals-row td:first-child::after {
                        content: "Summary of overall goal and total raised";
                        display: block;
                        font-size: 0.85rem;
                        font-weight: 400;
                        margin-top: 0.35rem;
                        opacity: 0.8;
                    }

                    .mobile-table-wrap .table.is-hoverable tbody tr:hover {
                        background-color: inherit !important;
                    }

                    .mobile-table-wrap .totals-row,
                    .mobile-table-wrap .totals-row:hover,
                    .mobile-table-wrap .totals-row:active,
                    .mobile-table-wrap .totals-row:focus {
                        background-color: #ffffff !important;
                    }
                    .mobile-table-wrap .totals-row * {
                        background-color: #ffffff !important;
                    }
                }

                @media (min-width: 769px) {
                    .mobile-table-wrap .totals-row td {
                        font-weight: 600;
                    }
                }
                `}
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
                <tr className="totals-row">
                    <td className="has-text-centered" colSpan={4}>
                        <strong>Total</strong>
                    </td>
                    {(() => {
                        // decide order so smaller value appears first on mobile
                        const firstVal = total <= totalRaised ? total : totalRaised;
                        const secondVal = total <= totalRaised ? totalRaised : total;
                        const firstLabel = total <= totalRaised ? "Goal" : "Raised";
                        const secondLabel = total <= totalRaised ? "Raised" : "Goal";
                        return (
                            <>
                                <td data-label={firstLabel} className={"has-text-centered"}>{formatCurrency(firstVal)}</td>
                                <td data-label={secondLabel} className={"has-text-centered"}>{formatCurrency(secondVal)}</td>
                            </>
                        );
                    })()}
                </tr>
                </tbody>
            </table>
        </div>
    );
};
