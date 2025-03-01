import React,{ useState, useEffect } from "react";

const Table = () => {




    const [totalRaised, setTotalRaised] = useState(Array(7).fill('NA'));

    useEffect(() => {
        const fetchTotalRaised = async () => {
            const results = await Promise.all(apiEndpoints.map(async (url, index) => {
                if (!url) return 'NA';
                try {
                    const response = await fetch(url, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const data = await response.json();
                    return data.totalRaisedOnline || 'NA';
                } catch (error) {
                    console.error(`Error fetching API ${index + 1}:`, error);
                    return 'NA';
                }
            }));
            setTotalRaised(results);
        };

        fetchTotalRaised();
    }, []);


//https://api.justgiving.com/b0e2e36e/v1/account/katy.horgan@gmail.com/pages


    const apiEndpoints = [
        'https://example.com/api2',
        'https://api.justgiving.com/b0e2e36e/v1/fundraising/pagebyid/53145105',
        'https://api.justgiving.com/b0e2e36e/v1/fundraising/pagebyid/53145107',
        'https://example.com/api5',
        '',
        'https://api.justgiving.com/b0e2e36e/v1/fundraising/pagebyid/53145141'
    ];


    const Hyperlinks = [
        "https://dkms.enthuse.com/pf/katharine-horgan",
        "https://www.justgiving.com/page/katharine-horgan-1733759668565?newPage=true",
        "https://www.justgiving.com/page/katharine-horgan-1733759798650?newPage=true",
        "https://example.com/link5",
        "https://example.com/link7",
        "https://www.justgiving.com/page/katharine-horgan-1733760696898?newPage=true",
        "https://example.com/link8"
    ];
    const words = ["Hapmton Court Half (London)", "London Landmarks Half Marathon (London)", "Hackney Half Marathon (London)", 
        "The Big Half (London)", "Run-Fest Richmond Half (London)", "Berlin Marathon (Berlin)","Royal Parks Half Marathon (London)"];
    const dates=["23rd March","6th April","18th May","7th September","14th September","21st September","12th October"];       
    const charity=["DKMS","Shelter","Winston's Wish","NA","NA","Antony Nolan","NA"]
    const goals = ["£150", "£329", "£300", "NA", "NA", "£1200", "NA"];
    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <table border="1" style={{ width: "50%", borderCollapse: "collapse" }}>
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
                    {Hyperlinks.map((link, rowIndex) => (
                        <tr key={rowIndex}>
                            <td style={{ padding: "10px", textAlign: "center" }}>{dates[rowIndex]}</td>
                            <td style={{ padding: "10px", textAlign: "center" }}>{words[rowIndex]}</td>
                            <td style={{ padding: "10px", textAlign: "center" }}>{charity[rowIndex]}</td>
                            <td style={{ padding: "10px", textAlign: "center" }}>
                                <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                            </td>
                            <td style={{ padding: "10px", textAlign: "center" }}>{goals[rowIndex]}</td>
                            
                            <td style={{ padding: '10px', textAlign: 'center' }}>
                                {totalRaised[rowIndex]}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
