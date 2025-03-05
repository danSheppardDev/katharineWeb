import {fetchData} from "./fetchData";

const sheetId = '1ObNjh7ZGVhv9TM1opkkw0lN4cwmfja1aSDSAGzXgidY';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'fundraiser_data';
const query = encodeURIComponent('Select *')
const url = `${base}&sheet=${sheetName}&tq=${query}`;

export async function fetchGoogleSheetsFundraiserData(): Promise<FundraiserData[]> {
    const data = await fetchData<any>(url, {}, true);
    const rowData = data.table.rows;
    return rowData.map((row: any) => {
        return {
            name: row.c[0].v,
            date: new Date(row.c[1].f),
            url: row.c[4] ? row.c[4].v : "",
            charityName: row.c[5] ? row.c[5].v : "",
            charityUrl: row.c[6].v ? row.c[6].v : "",
            fundraisingTarget: Number(row.c[2].v),
            totalRaised: Number(row.c[3].v),
            progressPercentage: row.c[3].v && row.c[2].v ? (Number(row.c[3].v) / Number(row.c[2].v)) * 100 : 0,
        } as FundraiserData;
    });
}

