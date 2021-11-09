import {
    GET_NOTICIA,
    CREATE_NOTICIA,
    DELETE_NOTICIA,
    LIST_NOTICIAS,
    UPDATE_NOTICIA
} from "./graphql/noticias";
import { request } from "graphql-request";

/**
 * An example of an end-to-end (E2E) test. You can use these to test if the overall cloud infrastructure
 * setup is working. That's why, here we're not executing the handler code directly, but issuing real
 * HTTP requests over to the deployed Amazon Cloudfront distribution. These tests provide the highest
 * level of confidence that our application is working, but they take more time in order to complete.
 * https://www.webiny.com/docs/how-to-guides/scaffolding/extend-graphql-api#crude2etestts
 */

const query = async ({ query = "", variables = {} } = {}) => {
    return request(process.env.API_URL + "/graphql", query, variables);
};

let testNoticias = [];

describe("Noticias CRUD tests (end-to-end)", () => {
    beforeEach(async () => {
        for (let i = 0; i < 3; i++) {
            testNoticias.push(
                await query({
                    query: CREATE_NOTICIA,
                    variables: {
                        data: {
                            title: `Noticia ${i}`,
                            description: `Noticia ${i}'s description.`
                        }
                    }
                }).then(response => response.noticias.createNoticia)
            );
        }
    });

    afterEach(async () => {
        for (let i = 0; i < 3; i++) {
            try {
                await query({
                    query: DELETE_NOTICIA,
                    variables: {
                        id: testNoticias[i].id
                    }
                });
            } catch {
                // Some of the entries might've been deleted during runtime.
                // We can ignore thrown errors.
            }
        }
        testNoticias = [];
    });

    it("should be able to perform basic CRUD operations", async () => {
        // 1. Now that we have noticias created, let's see if they come up in a basic listNoticias query.
        const [noticia0, noticia1, noticia2] = testNoticias;

        await query({
            query: LIST_NOTICIAS,
            variables: { limit: 3 }
        }).then(response =>
            expect(response.noticias.listNoticias).toMatchObject({
                data: [noticia2, noticia1, noticia0],
                meta: {
                    limit: 3
                }
            })
        );

        // 2. Delete noticia 1.
        await query({
            query: DELETE_NOTICIA,
            variables: {
                id: noticia1.id
            }
        });

        await query({
            query: LIST_NOTICIAS,
            variables: {
                limit: 2
            }
        }).then(response =>
            expect(response.noticias.listNoticias).toMatchObject({
                data: [noticia2, noticia0],
                meta: {
                    limit: 2
                }
            })
        );

        // 3. Update noticia 0.
        await query({
            query: UPDATE_NOTICIA,
            variables: {
                id: noticia0.id,
                data: {
                    title: "Noticia 0 - UPDATED",
                    description: `Noticia 0's description - UPDATED.`
                }
            }
        }).then(response =>
            expect(response.noticias.updateNoticia).toEqual({
                id: noticia0.id,
                title: "Noticia 0 - UPDATED",
                description: `Noticia 0's description - UPDATED.`
            })
        );

        // 4. Get noticia 0 after the update.
        await query({
            query: GET_NOTICIA,
            variables: {
                id: noticia0.id
            }
        }).then(response =>
            expect(response.noticias.getNoticia).toEqual({
                id: noticia0.id,
                title: "Noticia 0 - UPDATED",
                description: `Noticia 0's description - UPDATED.`
            })
        );
    });
});
