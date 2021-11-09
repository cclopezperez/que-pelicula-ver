export interface NoticiaEntity {
    PK: string;
    SK: string;
    id: string;
    title: string;
    subtitle: string;
    description?: string;
    mainImage?: string;
    createdOn: string;
    savedOn: string;
    webinyVersion: string;
}
