import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://kodomo-shinro.jp/",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1.0,
        },
        {
            url: "https://kodomo-shinro.jp/guide/support-school",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: "https://kodomo-shinro.jp/guide/futoko-shinro",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: "https://kodomo-shinro.jp/guide/erabikata",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
    ];
}
