import puppeteer from "puppeteer-core";
import fs from "fs";

const url = "https://www.scrapethissite.com/pages/forms/?page_num=";
const maxPages = 10; 

async function scrapeHockeyData(){
    
    const browser = await puppeteer.launch({ 
        headless: true,                                    // Runs without opening a visible browser (faster & efficient).
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"    // Specifies Chrome's path where chrome is installed.
    });

    const page = await browser.newPage();
    const userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:100.0) Gecko/20100101 Firefox/100.0"
    ];
    await page.setUserAgent(userAgents[Math.floor(Math.random() * userAgents.length)]);    

    // Why? Many websites block bots. Changing the User-Agent makes it look like a real browser.
    // How? We pick a random User-Agent from a list every time the script runs.

    let allTeams = [];

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        console.log(`Scraping Page ${pageNum}...`);
        
        await page.goto(`${url}${pageNum}`, { waitUntil: "networkidle2" });     // goto() -> Loads the webpage dynamically
        await page.waitForSelector("tr.team");                                  // Ensures the page is fully loaded before scraping.
        
        //document.querySelectorAll(".some-class") → Returns a NodeList (not an array).
        //  Array.from() → Converts NodeList into a real array.
        // .map(el => el.textContent.trim()) → Loops over elements and extracts text.

        const teams = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("tr.team")).map(team => ({
                name: team.querySelector(".name")?.innerText.trim() || "",
                year: team.querySelector(".year")?.innerText.trim() || "",
                wins: team.querySelector(".wins")?.innerText.trim() || "0",
                losses: team.querySelector(".losses")?.innerText.trim() || "0",
                otLosses: team.querySelector(".ot-losses")?.innerText.trim() || "0",
                winPct: team.querySelector(".pct")?.innerText.trim() || "0.000",
                goalsFor: team.querySelector(".gf")?.innerText.trim() || "0",
                goalsAgainst: team.querySelector(".ga")?.innerText.trim() || "0",
                goalDiff: team.querySelector(".diff")?.innerText.trim() || "0"
            }));
        });

        allTeams = allTeams.concat(teams);  // combines two or more arrays into a single array.
    }

        fs.writeFileSync("hockeyData.json", JSON.stringify(allTeams, null, 2));  // Writes the scraped data to a JSON file.

        const csvData = ["Name,Year,Wins,Losses,OT Losses,Win %,Goals For,Goals Against,Goal Diff",
            ...allTeams.map(team => 
                `${team.name},${team.year},${team.wins},${team.losses},${team.otLosses},${team.winPct},${team.goalsFor},${team.goalsAgainst},${team.goalDiff}`
            )
        ].join("\n")

        fs.writeFileSync("hockeyData.csv", csvData);  // Writes the scraped data to a CSV file.
    

        await browser.close();
        console.log("Scraping complete! Data saved.");

}

scrapeHockeyData();



