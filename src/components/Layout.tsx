import React, { useEffect, useState } from "react";
import { fetchJustGivingFundraiserDetails } from "../helpers/fetchJustGivingData";
import { Table } from "./Table";
import { ProgressCards } from "./ProgressCards";
import { fetchGoogleSheetsFundraiserData } from "../helpers/fetchGoogleSheetData";

export const Layout = () => {
  const [getFundraisers, setFundraisers] = useState<FundraiserData[]>([]);
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

      const currentTime = Date.now();
      const cacheAge = cachedTimestamp ? currentTime - Number(cachedTimestamp) : Infinity;

      if (cachedData && cacheAge < 60 * 60 * 1000) {
        const data = JSON.parse(cachedData);
        setFundraisers(sortFundraisersByDate(data));
        setTotalAndRaised(data);
        setLoading(false);
        return;
      }

      // Fetch new data from the API
      const justGivingData = await fetchJustGivingFundraiserDetails();
      const googleSheetsData = await fetchGoogleSheetsFundraiserData();
      const combinedData = sortFundraisersByDate([...justGivingData, ...googleSheetsData]);
      setFundraisers(combinedData);
      setTotalAndRaised(combinedData);
      localStorage.setItem("fundraisers", JSON.stringify(combinedData));
      localStorage.setItem("fundraisersTimestamp", String(Date.now()));
      setLoading(false);
    };

    fetchData();
  }, []);

  /**
   * Calculate total amount needed and total amount raised for all campaigns.
   * Runs whenever the fundraiser array changes.
   */
  const setTotalAndRaised = (fundraisers: FundraiserData[]) => {
    let newTotal = 0;
    let newTotalRaised = 0;
    for (const f of fundraisers) {
      if (f.fundraisingTarget && f.totalRaised) {
        newTotal += Number(f.fundraisingTarget);
        newTotalRaised += Number(f.totalRaised);
      }
    }
    setTotal(newTotal);
    setTotalRaised(newTotalRaised);
  };

  /**
   * Sort fundraisers by date ascending (immutable)
   * @param data The fundraiser data array
   * @returns A new sorted array
   */
  const sortFundraisersByDate = (data: FundraiserData[]) => {
    return [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const MemoizedProgressCards = React.memo(ProgressCards);
  const MemoizedTable = React.memo(Table);

  return (
    <div>
      {loading ? (
        <div className="is-flex is-justify-content-center is-align-items-center" style={{ height: "100vh" }}>
          <div className="loader is-loading"></div>
        </div>
      ) : (
        <>
          <a href="https://blogs.lse.ac.uk/vcb/2025/03/17/guest-blog-a-year-of-running-badly-for-a-good-cause/" rel="noreferrer" target="_blank"><h2 className="subtitle has-text-link has-text-centered">Read Katharine’s blog to learn more about why she picked these charities</h2></a>
          <div className={"section"} id={"results-table"}>
            <MemoizedTable fundraisers={getFundraisers} total={getTotal} totalRaised={getTotalRaised} />
          </div>
          <div className={"section"} id={"results-cards"}>
            <div className={"fixed-grid has-1-cols-mobile has-2-cols-desktop "}>
              <MemoizedProgressCards fundraisers={getFundraisers} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
