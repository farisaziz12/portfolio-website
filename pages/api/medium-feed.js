const { parse } = require("rss-to-json");

export default async function handler(req, res) {
  try {
    const response = await parse("https://medium.com/feed/@farisaziz12");

    res.status(200).json({
      ...response,
      items: response.items.slice(0, 3).map((item) => ({
        ...item,
        imageSrc: item.content.match(/src="(.*?)"/)[1]
      })),
    });
  } catch (error) {
    res.status(500).json(error);
  }
}
