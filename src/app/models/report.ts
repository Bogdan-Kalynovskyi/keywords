export class Report {
    id: number;
    name: string;
    keywords: string;
    isGoogle: boolean;
    siteUrl: string;
    // dateFromAvailable: string;
    // dateToAvailable: string;

    constructor (id, name, keywords, isGoogle, siteUrl) {
        this.id = id;
        this.name = name;
        this.keywords = keywords;
        this.isGoogle = isGoogle;
        this.siteUrl = siteUrl;
    }
}