/**
 * Contains all of the GraphQL queries and mutations that we might need while writing our tests.
 * If needed, feel free to add more.
 */

export const GET_NOTICIA = /* GraphQL */ `
    query GetNoticia($id: ID!) {
        noticias {
            getNoticia(id: $id) {
                id
                title
                description
            }
        }
    }
`;

export const CREATE_NOTICIA = /* GraphQL */ `
    mutation CreateNoticia($data: NoticiaCreateInput!) {
        noticias {
            createNoticia(data: $data) {
                id
                title
                description
            }
        }
    }
`;

export const UPDATE_NOTICIA = /* GraphQL*/ `
    mutation UpdateNoticia($id: ID!, $data: NoticiaUpdateInput!) {
        noticias {
            updateNoticia(id: $id, data: $data) {
                id
                title
                description
            }
        }
    }
`;

export const DELETE_NOTICIA = /* GraphQL */ `
    mutation DeleteNoticia($id: ID!) {
        noticias {
            deleteNoticia(id: $id) {
                id
                title
                description
            }
        }
    }
`;

export const LIST_NOTICIAS = /* GraphQL */ `
    query ListNoticias($sort: NoticiasListSort, $limit: Int, $after: String) {
        noticias {
            listNoticias(sort: $sort, limit: $limit, after: $after) {
                data {
                    id
                    title
                    description
                }
                meta {
                    limit
                    after
                    before
                }
            }
        }
    }
`;
