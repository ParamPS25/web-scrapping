// import express from 'express';
// import puppeteer from 'puppeteer';
// import dotenv from 'dotenv';
// import fs from 'fs';

// dotenv.config();

// const app = express();
// const PORT = 8080 || process.env.PORT;

// app.get('/', (req, res) => {
//     res.send('Cric API');
// });

// // Helper function to get a random proxy
// const getRandomProxy = () => {
//   const proxies = fs.readFileSync("proxies.txt", "utf-8").split("\n").filter(Boolean);
//   return proxies[Math.floor(Math.random() * proxies.length)];
// };

// // Puppeteer route with rotating proxy
// app.get("/player/:playerName", async (req, res) => {
//     const { playerName } = req.params;
  
//     try {
//       const proxy = getRandomProxy();
//       console.log(`Using proxy: ${proxy}`);
  
//       const browser = await puppeteer.launch({
//         headless: false,
//         // args: [`--proxy-server=${proxy}`, "--ignore-certificate-errors", "--no-sandbox"],
//       });
//       const page = await browser.newPage();
  
//       // Rotate user agents
//       const userAgents = [
//         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
//         "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
//       ];
//       const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
//       await page.setUserAgent(randomUserAgent);
  
//       console.log(`Searching for player: ${playerName}`);
//       await page.goto(`http://www.google.com/search?q=${playerName}%20cricbuzz`, {
//         waitUntil: "networkidle2",
//         timeout: 60000,
//       });
  
//       const isCaptcha = await page.evaluate(() => {
//         return !!document.querySelector("#captcha-form") || !!document.querySelector("div.rc-anchor");
//       });
  
//       if (isCaptcha) {
//         console.error("CAPTCHA detected.");
//         await browser.close();
//         return res.status(429).json({ error: "CAPTCHA detected. Retry later or use better proxies." });
//       }
  
//       const content = await page.content();
//       fs.writeFileSync("debug.html", content);
  
//       const cricbuzzLink = await page.evaluate(() => {
//         const link = Array.from(document.querySelectorAll("a")).find((a) =>
//           a.href.includes("cricbuzz.com/profiles")
//         );
//         return link ? link.href : null;
//       });
  
//       console.log("Cricbuzz link found:", cricbuzzLink);
//       if (!cricbuzzLink) {
//         await browser.close();
//         return res.status(404).json({ error: "Player not found on Cricbuzz" });
//       }
  
//       await page.goto(cricbuzzLink, { waitUntil: "networkidle2" });
//       const playerData = await page.evaluate(() => {
//         const name = document.querySelector("h1.cb-font-40")?.innerText || "";
//         const country = document.querySelector("h3.cb-font-18.text-gray")?.innerText || "";
//         return { name, country };
//       });
  
//       console.log("Player Data:", playerData);
//       await browser.close();
//       res.json(playerData);
//     } catch (error) {
//       console.error("Error fetching player data:", error);
//       res.status(500).json({ error: "An error occurred while fetching player data" });
//     }
//   });
  
// app.listen(PORT, () => {
//     console.log(`Server running on port : ${PORT}`);
// });


import express from "express";
import puppeteer from "puppeteer";
import dotenv from "dotenv";
import { getJson } from "serpapi";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Cric API");
});

app.get("/player/:playerName", (req, res) => {
  const playerName = req.params.playerName;

  console.log(`Searching for player: ${playerName}`);

  // Use SerpAPI to find the Cricbuzz profile link
  getJson(
    {
      q: `${playerName} Cricbuzz`,
      location: "United States",
      hl: "en",
      gl: "us",
      google_domain: "google.com",
      api_key: process.env.SERPAPI_API_KEY,
    },
    async (data) => {
      try {
        // Extract the Cricbuzz profile link
        const cricbuzzLink = data.organic_results?.find((result) =>
          result.link.includes("cricbuzz.com/profiles")
        )?.link;

        console.log("Cricbuzz link found:", cricbuzzLink);

        if (!cricbuzzLink) {
          return res
            .status(404)
            .json({ error: "Player not found on Cricbuzz" });
        }

        // Launch Puppeteer to scrape the Cricbuzz profile page
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        await page.goto(cricbuzzLink, { waitUntil: "networkidle2" });

        const playerData = await page.evaluate(() => {
          const name = document.querySelector("h1.cb-font-40")?.innerText || "";
          const country =
            document.querySelector("h3.cb-font-18.text-gray")?.innerText || "";

          const personalInfo = Array.from(
            document.querySelectorAll("div.cb-col.cb-col-60.cb-lst-itm-sm")
          ).map((el) => el.innerText.trim());

          const battingSummary = Array.from(
            document.querySelectorAll(".cb-plyr-tbl:nth-of-type(1) td.text-right")
          ).map((el) => el.innerText);

          const bowlingSummary = Array.from(
            document.querySelectorAll(".cb-plyr-tbl:nth-of-type(2) td.text-right")
          ).map((el) => el.innerText);

          return {
            name,
            country,
            role: personalInfo[2] || "",
            batting: {
              test: {
                matches: battingSummary[0],
                runs: battingSummary[3],
                hs: battingSummary[4],
                avg: battingSummary[5],
                sr: battingSummary[7],
                hundreds: battingSummary[8],
                fifties: battingSummary[10],
              },
              odi: {
                matches: battingSummary[13],
                runs: battingSummary[16],
                hs: battingSummary[17],
                avg: battingSummary[18],
                sr: battingSummary[20],
                hundreds: battingSummary[21],
                fifties: battingSummary[23],
              },
              t20: {
                matches: battingSummary[26],
                runs: battingSummary[29],
                hs: battingSummary[30],
                avg: battingSummary[31],
                sr: battingSummary[33],
                hundreds: battingSummary[34],
                fifties: battingSummary[36],
              },
            },
            bowling: {
              test: {
                balls: bowlingSummary[2],
                runs: bowlingSummary[3],
                wickets: bowlingSummary[4],
                bbi: bowlingSummary[5],
                econ: bowlingSummary[7],
                fiveWickets: bowlingSummary[10],
              },
              odi: {
                balls: bowlingSummary[14],
                runs: bowlingSummary[15],
                wickets: bowlingSummary[16],
                bbi: bowlingSummary[17],
                econ: bowlingSummary[19],
                fiveWickets: bowlingSummary[22],
              },
              t20: {
                balls: bowlingSummary[26],
                runs: bowlingSummary[27],
                wickets: bowlingSummary[28],
                bbi: bowlingSummary[29],
                econ: bowlingSummary[31],
                fiveWickets: bowlingSummary[34],
              },
            },
          };
        });

        console.log("Player Data:", playerData);
        await browser.close();
        res.json(playerData);
      } catch (error) {
        console.error("Error fetching player data:", error);
        res
          .status(500)
          .json({ error: "An error occurred while fetching player data" });
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on Port: ${PORT}`);
});
