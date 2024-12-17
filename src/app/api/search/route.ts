import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    const browser = await puppeteer.launch({ headless: true }); // Set headless to false for debugging
    const page = await browser.newPage();

    // Navigate to the filing tracker page
    await page.goto("https://webservices.sos.state.tx.us/filing-status/status.aspx", {
      waitUntil: "domcontentloaded",
    });

    // Type the entity name into the input field
    await page.type("input[name='txtEntityName']", query);

    // Click the search button
    await page.click("input[name='btnEntityName']");

    //await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for 3 seconds

    
    // Wait for either the results table or the "No Results" message to appear
    const dataExists = await page.waitForFunction(() => {
      const resultsTable = document.querySelector("#grdAll");
      const noDataMessage = document.querySelector("#lblNoData1");
      console.log(resultsTable);
      console.log(noDataMessage);
      return !!resultsTable || !!noDataMessage;
    },
      { timeout: 3000 } // Increase timeout to 3 seconds
    );

    if (!dataExists) {
      const message = await page.$eval("#lblNoData1", (el) => el.textContent?.trim());
      const hint = await page.$eval("#lblNoData2", (el) => el.textContent?.trim());
      await browser.close();
      console.log(message, hint);
      return NextResponse.json({ error: true, message, hint });
    }

    // Extract the data from the results table
    const results = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll("#grdAll tr"));
      console.log(rows);
      return rows.slice(1).map((row) => {
        const cells = row.querySelectorAll("td");
        return {
          viewLink: cells[0]?.querySelector("a")?.href.trim(),
          documentNumber: cells[1]?.innerText.trim(),
          entityName: cells[2]?.innerText.trim(),
          deliveryMethod: cells[3]?.innerText.trim(),
          expedited: cells[4]?.innerText.trim(),
          receivedDate: cells[5]?.innerText.trim(),
          documentType: cells[6]?.innerText.trim(),
          status: cells[7]?.innerText.trim(),
          filingNumber: cells[8]?.innerText.trim(),
        };
      });
    });

    // Log the results to the console for debugging
    console.log("Scraped Results:", results);


    // Close the browser
    await browser.close();

    // Return the extracted results
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error scraping data:", error);
    return NextResponse.json({ error: "Failed to fetch data", details: error.message }, { status: 500 });
  }
}
