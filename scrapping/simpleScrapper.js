import axios from 'axios';
import * as cheerio from "cheerio";

// URL of the target webpage
const url = "https://www.scrapethissite.com/pages/simple/";

async function scrapeCountries() {
    try {
        // Fetch the HTML content
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Array to store countries data
        const countriesData = [];

        // Find all country blocks
        $(".col-md-4.country").each((index, element) => {
            const name = $(element).find(".country-name").text().trim();
            const capital = $(element).find(".country-capital").text().trim();
            const population = $(element).find(".country-population").text().trim();
            const area = $(element).find(".country-area").text().trim();

            countriesData.push({
                name,
                capital,
                population,
                area    
            });
        });

        // Log the scraped data after extraction is complete
        console.log(countriesData);

    } catch (error) {
        console.error("Error fetching data:", error.message);
    }
}

// Run the scraper
scrapeCountries();


