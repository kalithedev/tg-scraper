const { telegram_scraper } = require("../src/telegram-scraper");
const http = require("http");
const url = require("url");

const serverport = process.env.PORT || 8080;

let telegram_channel = "PainofMoney";

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const limit = parsedUrl.query.limit ? parseInt(parsedUrl.query.limit) : 100;

  console.log(
    `Received request for channel: ${telegram_channel}, limit: ${limit}`,
  );

  try {
    let result = await telegram_scraper(telegram_channel, limit);
    let parsedResult = JSON.parse(result);

    console.log(`Scraped ${parsedResult.length} messages`);

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end(result);
  } catch (error) {
    console.error("Error during scraping:", error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "An error occurred during scraping" }));
  }
});

server.listen(serverport, () => {
  console.log(`Server running at ${serverport}`);
});
