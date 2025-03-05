import React from "react";
import { formatCurrency } from "../helpers/Formatting";

interface ProgressCardProps {
    fundraisers: FundraiserData[];
}

/**
 * Returns a colour class based on the completion percentage of a campaign
 * @param percentage The completion percentage
 * @returns A bulma CSS class
 */
const getProgressClass = (percentage: number): string => {
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
    if (!fundraisers || fundraisers.length === 0) {
        return <div>No fundraisers available</div>;
    }

    return (
        <div className="grid">
            {fundraisers.filter(fr => fr.url !== "").map((f, index) => {
                const { name, totalRaised, fundraisingTarget, url } = f;
                let progress = 0;

                // Ensure totalRaised and fundraisingTarget are valid numbers
                if (fundraisingTarget > 0 && !isNaN(totalRaised) && !isNaN(fundraisingTarget)) {
                    progress = Math.floor((totalRaised / fundraisingTarget) * 100);
                }

                return (
                    <div className="cell" key={index}>
                        <div className="card my-6">
                            <header className="card-header">
                                <p className="card-header-title">{name}</p>
                            </header>
                            <div className="card-content">
                                <div className="content">
                                    <div className="columns is-vcentered is-mobile">
                                        <div className="column is-one-third has-text-left">
                                            <span>Raised: {formatCurrency(totalRaised)}</span>
                                        </div>
                                        <div className="column is-one-third has-text-centered">
                                            <span>{progress}% Raised</span>
                                        </div>
                                        <div className="column is-one-third has-text-right">
                                            <span>Goal: {formatCurrency(fundraisingTarget)}</span>
                                        </div>
                                    </div>
                                    <progress
                                        className={`progress ${getProgressClass(progress)}`}
                                        value={totalRaised}
                                        max={fundraisingTarget}
                                    />
                                </div>
                            </div>
                            <footer className="card-footer">
                                <a href={url} className="card-footer-item">Donate</a>
                            </footer>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

