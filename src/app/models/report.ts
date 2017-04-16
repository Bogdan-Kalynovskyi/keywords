export class Report {
    id: number;
    name: string;
    keywords: string;
    siteUrl: string;

    constructor (id, name, keywords, siteUrl) {
        this.id = id;
        this.name = name;
        this.keywords = keywords;
        this.siteUrl = siteUrl;
    }
}