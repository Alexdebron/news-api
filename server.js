import express from "express";
import axios from "axios";
import cheerio from "cheerio";

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Scrapers =====
async function hirunews() {
  try {
    const { data } = await axios.get("https://www.hirunews.lk/");
    const $ = cheerio.load(data);
    const latestUrl = $(".card-v1").attr("href");
    const latestGet = await axios.get(latestUrl);
    const $2 = cheerio.load(latestGet.data);

    const title = $2(".head-title").text().trim();
    const image = $2(".featured-image > img").attr("src");
    const date = $2(".head-content > div > span:nth-child(2)").text().trim();
    const desc = $2("#this-article")
      .html()
      .replace(/<br\s*\/?>/gi, "\n\n")
      .replace(/\n{2,}/g, "\n\n")
      .replace(/<[^>]+>/g, "")
      .trim();

    return { title, image, date, desc, url: latestUrl };
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

async function sirasanews() {
  try {
    const baseUrl = "https://sinhala.newsfirst.lk";
    const { data } = await axios.get(`${baseUrl}/latest-news`);
    const $ = cheerio.load(data);
    let latestUrl = $(".ng-star-inserted > div > div > a").attr("href");
    latestUrl = baseUrl + latestUrl;

    const latestGet = await axios.get(latestUrl);
    const $2 = cheerio.load(latestGet.data);

    const title = $2(".ng-star-inserted > h1").text().trim();
    const image = $2("#post_img").attr("src");
    const date = $2(".author_main > span").text().trim();
    const desc = $2("#testId")
      .html()
      .replace(/<p\s*\/?>/gi, "\n\n")
      .replace(/\n{2,}/g, "\n\n")
      .replace(/<[^>]+>/g, "")
      .trim();

    return { title, image, date, desc, url: latestUrl };
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

async function derananews() {
  try {
    const baseUrl = "https://sinhala.adaderana.lk/";
    const { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    let latestUrl = $(".col-xs-12.col-sm-6.col-md-5 > div > div > h3 > a").attr("href");
    latestUrl = baseUrl + latestUrl;

    const latestGet = await axios.get(latestUrl);
    const $2 = cheerio.load(latestGet.data);

    const title = $2(".news-heading").text().trim();
    const image = $2(".news-banner > img").attr("src");
    const date = $2(".col-xs-12.col-sm-8.col-lg-7 > article > p").text().trim().replace(/\s+/g, " ");
    const desc = $2(".news-content")
      .html()
      .replace(/<p\s*\/?>/gi, "\n\n")
      .replace(/\n{2,}/g, "\n\n")
      .replace(/<[^>]+>/g, "")
      .trim();

    return { title, image, date, desc, url: latestUrl };
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

// ===== API Endpoints =====

// Hiru News
app.get("/api/news/hiru", async (req, res) => {
  const result = await hirunews();
  res.json({ status: true, creator: "Chamod Nimsara", result });
});

// Sirasa News
app.get("/api/news/sirasa", async (req, res) => {
  const result = await sirasanews();
  res.json({ status: true, creator: "Chamod Nimsara", result });
});

// Derana News
app.get("/api/news/derana", async (req, res) => {
  const result = await derananews();
  res.json({ status: true, creator: "Chamod Nimsara", result });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
