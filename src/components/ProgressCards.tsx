import React from "react";
import {formatCurrency} from "../helpers/Formatting";

interface ProgressCardProps {
    fundraisers: FundraiserDetails[];
}

/**
 * Returns a colour class based on the completion percentage of a campaign
 * @param percentage The completion percentage
 * @returns A bulma CSS class
 */
const getProgressClass = (percentage: number) => {
    if (percentage >= 75) return "is-success";
    if (percentage >= 50) return "is-primary";
    if (percentage >= 25) return "is-info";
    return "is-warning";
};

/**
 * Renders a grid of cards representing fundraiser progress
 * @param fundraisers The fundraiser data array fetched from the API and data file
 * @constructor
 */
export const ProgressCards = ({ fundraisers }: ProgressCardProps) => {
    return (
        <div className={"grid"}>
            {fundraisers.map((f, index) => {
                const { eventName, totalRaised, totalRaisedPercentageOfFundraisingTarget, fundraisingTarget, url } = f;
                const progressPercentage = Number(totalRaisedPercentageOfFundraisingTarget);

                return (
                    <div className={"cell"} key={index}>
                        <div key={index} className="card my-6">
                            <header className="card-header">
                                <p className="card-header-title">{eventName}</p>
                            </header>
                            <div className="card-content">
                                <div className="content">
                                    <div className="columns is-vcentered is-mobile">
                                        <div className="column is-one-third has-text-left">
                                            <span>Raised: {formatCurrency(totalRaised)}</span>
                                        </div>
                                        <div className="column is-one-third has-text-centered">
                                            <span>{progressPercentage ? progressPercentage : 0}% Raised</span>
                                        </div>
                                        <div className="column is-one-third has-text-right">
                                            <span>Goal: {formatCurrency(fundraisingTarget)}</span>
                                        </div>
                                    </div>
                                    <progress
                                        className={`progress ${getProgressClass(progressPercentage)}`}
                                        value={totalRaised}
                                        max={fundraisingTarget}
                                    />
                                </div>
                            </div>
                            {url && (
                                <footer className="card-footer">
                                    <a href={url} className="card-footer-item">Donate</a>
                                </footer>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
