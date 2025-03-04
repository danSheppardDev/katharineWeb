import React from "react";
import {formatCurrency, formatLink} from "../helpers/Formatting";

interface TableProps {
    fundraisers: FundraiserDetails[];
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
    return (
        <div className="table-container">
            <table className="table mx-auto is-bordered">
                <thead>
                <tr>
                    <th>Dates</th>
                    <th>Race</th>
                    <th>Charity</th>
                    <th>Link</th>
                    <th>Goal</th>
                    <th>Total Raised</th>
                </tr>
                </thead>
                <tbody>
                {fundraisers.map((f, index) => {
                    const { eventDate, eventName, charityName, charityUrl, url, fundraisingTarget, totalRaised, totalRaisedPercentageOfFundraisingTarget } = f;
                    return (
                        <tr key={index}>
                            <td className="has-text-centered">{eventDate}</td>
                            <td className="has-text-centered">{eventName}</td>
                            <td className="has-text-centered">{formatLink(charityUrl, charityName)}</td>
                            <td className="has-text-centered">{formatLink(url, "Click here")}</td>
                            <td className="has-text-centered">{formatCurrency(fundraisingTarget)}</td>
                            <td className="has-text-centered">{totalRaisedPercentageOfFundraisingTarget == 100 ? "Target hit" : formatCurrency(totalRaised)}</td>
                        </tr>
                    );
                })}
                <tr>
                    <td className="has-text-centered" colSpan={4}>
                        <strong>Total</strong>
                    </td>
                    <td className={"has-text-centered"}>{`£${totalRaised}`}</td>
                    <td className={"has-text-centered"}>{`£${total}`}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};
