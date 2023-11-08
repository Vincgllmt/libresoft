interface Software {
    name: string;
    id: number;
    url: string;
    description: string;
    external_resources: {
        github: string,
        website: string
    }
}