export default /* GraphQL */ `
    type Noticia {
        id: ID!
        title: String!
        subtitle: String!
        description: String
        mainImage: String
        createdOn: DateTime!
        savedOn: DateTime!
    }

    input NoticiaCreateInput {
        title: String!
        subtitle: String!
        description: String
        mainImage: String
    }

    input NoticiaUpdateInput {
        title: String
        subtitle: String!
        description: String
        mainImage: String
    }

    type NoticiasListMeta {
        limit: Number
        before: String
        after: String
    }

    enum NoticiasListSort {
        createdOn_ASC
        createdOn_DESC
    }

    type NoticiasList {
        data: [Noticia]
        meta: NoticiasListMeta
    }

    type NoticiaQuery {
        # Returns a single Noticia entry.
        getNoticia(id: ID!): Noticia

        # Lists one or more Noticia entries.
        listNoticias(
            limit: Int
            before: String
            after: String
            sort: NoticiasListSort
        ): NoticiasList!
    }

    type NoticiaMutation {
        # Creates and returns a new Noticia entry.
        createNoticia(data: NoticiaCreateInput!): Noticia!

        # Updates and returns an existing Noticia entry.
        updateNoticia(id: ID!, data: NoticiaUpdateInput!): Noticia!

        # Deletes and returns an existing Noticia entry.
        deleteNoticia(id: ID!): Noticia!
    }

    extend type Query {
        noticias: NoticiaQuery
    }

    extend type Mutation {
        noticias: NoticiaMutation
    }
`;
