export class Report {
    id: number;
    name: string;
    keywords: string;

    constructor (id, name, keywords) {
        this.id = id;
        this.name = name;
        this.keywords = keywords;
    }
}