import React, { useEffect, useState } from "react";
import { fetchFundraiserDetails } from "../helpers/fetchJustGivingData";
import { Table } from "./Table";
import { ProgressCards } from "./ProgressCards";
import { fundraisers } from "../data/Fundraisers";

export const Layout = () => {
    const [getFundraisers, setFundraisers] = useState<FundraiserDetails[]>([]);
    const [getTotal, setTotal] = useState<number>(0);
    const [getTotalRaised, setTotalRaised] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    /**
     * Fetch the latest data from the API and combine it with the stored data from the data directory.
     * Data should be cached for one hour to ensure the API isn't called too many times.
     * Run on first load only.
     */
    useEffect(() => {
        const fetchData = async () => {
            // Check for cached data in local storage first.
            const cachedData = localStorage.getItem("fundraisers");
            const cachedTimestamp = localStorage.getItem("fundraisersTimestamp");

            // If the data exists in the cache, check if it's older than one hour.
            if (cachedData && cachedTimestamp) {
                const currentTime = Date.now();
                const cacheAge = currentTime - Number(cachedTimestamp);

                // If the cache is too old, refresh the data
                if (cacheAge < 60 * 60 * 1000) {
                    const data = JSON.parse(cachedData);
                    setFundraisers(sortFundraisersByDate(data));
                    setLoading(false);
                    return;
                }
            }

            const data = await fetchFundraiserDetails();
            const combinedData = data.concat(fundraisers);
            setFundraisers(sortFundraisersByDate(combinedData));
            localStorage.setItem("fundraisers", JSON.stringify(combinedData));
            localStorage.setItem("fundraisersTimestamp", String(Date.now()));
            setLoading(false);
        };

        fetchData().then(() => {return});
    }, []);

    /**
     * Get the total amount needed and total amount raised for all campaigns.
     * Update if there is a change to the fundraiser array
     */
    useEffect(() => {
        let newTotal = 0;
        let newTotalRaised = 0;
        for (const f of getFundraisers) {
            if (f.totalRaised === "N/A" || f.totalRaised === "") continue;
            const amount = parseFloat(f.totalRaised.replace(/£/g, "").trim());
            if (!isNaN(amount)) {
                newTotal += amount;
            }
            if (f.fundraisingTarget === "N/A" || f.fundraisingTarget === "") continue;
            const raisedAmount = parseFloat(f.fundraisingTarget.replace(/£/g, "").trim());
            if (!isNaN(raisedAmount)) {
                newTotalRaised += raisedAmount;
            }
        }
        setTotal(newTotal);
        setTotalRaised(newTotalRaised);
    }, [getFundraisers]);

    /**
     * Sort fundraisers by date ascending
     * @param data The fundraiser data array fetched from the API and data file
     */
    const sortFundraisersByDate = (data: FundraiserDetails[]) => {
        return data.sort((a, b) => {
            // Convert the eventDate strings (dd/mm/yyyy) into a Date object by splitting
            const [dayA, monthA, yearA] = a.eventDate.split("/").map(Number);
            const [dayB, monthB, yearB] = b.eventDate.split("/").map(Number);

            // Create Date objects for comparison
            const dateA = new Date(yearA, monthA - 1, dayA);
            const dateB = new Date(yearB, monthB - 1, dayB);

            return dateA.getTime() - dateB.getTime();
        });
    };

    return (
        <div>
            {loading ? (
                <div className="is-flex is-justify-content-center is-align-items-center" style={{ height: "100vh" }}>
                    <div className="loader is-loading"></div>
                </div>
            ) : (
                <>
                    <div className={"section"} id={"results-table"}>
                        <Table fundraisers={getFundraisers} total={getTotal} totalRaised={getTotalRaised} />
                    </div>
                    <div className={"section"} id={"results-cards"}>
                        <div className={"fixed-grid has-1-cols-mobile has-2-cols-desktop "}>
                            <ProgressCards fundraisers={getFundraisers} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
