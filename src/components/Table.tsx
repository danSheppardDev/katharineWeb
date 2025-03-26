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
    const fundraisingProgress = useMemo(() => {
        return fundraisers.map(f => {
            const { totalRaised, fundraisingTarget } = f;
            if (!totalRaised || !fundraisingTarget) return 0;
            return Math.floor((totalRaised / fundraisingTarget) * 100);
        });
    }, [fundraisers]);

    return (
        <div className="table-container">
            <table className="table mx-auto is-bordered">
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
                {fundraisers.map((f, index) => {
                    const { date, name, charityName, url = "", fundraisingTarget, totalRaised } = f;
                    const progress = fundraisingProgress[index];
                    return (
                        <tr key={index}>
                            <td className="has-text-centered">{formatDate(date)}</td>
                            <td className="has-text-centered">{name}</td>
                            <td className="has-text-centered">{charityName}</td>
                            <td className="has-text-centered">{formatLink(url, "Click here", true)}</td>
                            <td className="has-text-centered">{formatCurrency(fundraisingTarget)}</td>
                            <td className="has-text-centered">{getTotalRaisedOrStatus(progress, totalRaised)}</td>
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
