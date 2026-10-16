import { NEWS_API_KEY, NEWS_API_URL } from "../config/api";
import { NewsApiResponse } from "../types/news";

export interface FetchNewsParams {
  query?: string;
  pageSize?: number;
  page?: number;
  country?: string;
  category?: string;
}

export const fetchTopHeadlines = async (params: FetchNewsParams = {}) => {
  const {
    query,
    pageSize = 10,
    page = 1,
    country = "us",
    category = "general",
  } = params;

  if (!NEWS_API_KEY) {
    throw new Error(
      "Please provide a valid NEWS_API_KEY in your environment variables.",
    );
  }

  const queryParam = new URLSearchParams({
    apiKey: NEWS_API_KEY,
    pageSize: pageSize.toString(),
    page: page.toString(),
    ...(category && { category }),
    ...(query && { q: query }),
  });

  const url = `${NEWS_API_URL}/top-headlines?${queryParam.toString()}`;
  if (!NEWS_API_KEY) {
    throw new Error(
      "Please provide a valid NEWS_API_KEY in your environment variables.",
    );
  }
  try {
    const response = await fetch(url);
    const data: NewsApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw new Error("Failed to fetch news. Please try again later.");
  }
};
