import wiki from "wikipedia";

async function getWikiSummary(title) {
    try {
		const page = await wiki.page(title);
		const summary = await page.summary();
        return {
            title: summary.title,
            extract: summary.extract,
            url: summary.content_urls.desktop.page
        }
	} catch (error) {
		console.log(error);
	}
}

export default getWikiSummary;