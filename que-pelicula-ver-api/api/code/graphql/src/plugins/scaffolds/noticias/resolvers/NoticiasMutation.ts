import { NoticiaEntity } from "../types";
import mdbid from "mdbid";
import { Noticia } from "../entities";
import NoticiasResolver from "./NoticiasResolver";

/**
 * Contains base `createNoticia`, `updateNoticia`, and `deleteNoticia` GraphQL resolver functions.
 * Feel free to adjust the code to your needs. Also, note that at some point in time, you will
 * most probably want to implement custom data validation and security-related checks.
 * https://www.webiny.com/docs/how-to-guides/scaffolding/extend-graphql-api#essential-files
 */

interface CreateNoticiaParams {
    data: {
        title: string;
        description?: string;
    };
}

interface UpdateNoticiaParams {
    id: string;
    data: {
        title: string;
        description?: string;
    };
}

interface DeleteNoticiaParams {
    id: string;
}

interface NoticiasMutation {
    createNoticia(params: CreateNoticiaParams): Promise<NoticiaEntity>;
    updateNoticia(params: UpdateNoticiaParams): Promise<NoticiaEntity>;
    deleteNoticia(params: DeleteNoticiaParams): Promise<NoticiaEntity>;
}

/**
 * To define our GraphQL resolvers, we are using the "class method resolvers" approach.
 * https://www.graphql-tools.com/docs/resolvers#class-method-resolvers
 */
export default class NoticiasMutation extends NoticiasResolver implements NoticiasMutation {
    /**
     * Creates and returns a new Noticia entry.
     * @param data
     */
    async createNoticia({ data }: CreateNoticiaParams) {
        // We use `mdbid` (https://www.npmjs.com/package/mdbid) library to generate
        // a random, unique, and sequential (sortable) ID for our new entry.
        const id = mdbid();

        const noticia = {
            ...data,
            PK: this.getPK(),
            SK: id,
            id,
            createdOn: new Date().toISOString(),
            savedOn: new Date().toISOString(),
            webinyVersion: process.env.WEBINY_VERSION
        };

        // Will throw an error if something goes wrong.
        await Noticia.put(noticia);

        return noticia;
    }

    /**
     * Updates and returns an existing Noticia entry.
     * @param id
     * @param data
     */
    async updateNoticia({ id, data }: UpdateNoticiaParams) {
        // If entry is not found, we throw an error.
        const { Item: noticia } = await Noticia.get({ PK: this.getPK(), SK: id });
        if (!noticia) {
            throw new Error(`Noticia "${id}" not found.`);
        }

        const updatedNoticia = { ...noticia, ...data };

        // Will throw an error if something goes wrong.
        await Noticia.update(updatedNoticia);

        return updatedNoticia;
    }

    /**
     * Deletes and returns an existing Noticia entry.
     * @param id
     */
    async deleteNoticia({ id }: DeleteNoticiaParams) {
        // If entry is not found, we throw an error.
        const { Item: noticia } = await Noticia.get({ PK: this.getPK(), SK: id });
        if (!noticia) {
            throw new Error(`Noticia "${id}" not found.`);
        }

        // Will throw an error if something goes wrong.
        await Noticia.delete(noticia);

        return noticia;
    }
}
