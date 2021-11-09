import { handler } from "~/index";
import {
    GET_NOTICIA,
    CREATE_NOTICIA,
    DELETE_NOTICIA,
    LIST_NOTICIAS,
    UPDATE_NOTICIA
} from "./graphql/noticias";

/**
 * An example of an integration test. You can use these to test your GraphQL resolvers, for example,
 * ensure they are correctly interacting with the database and other cloud infrastructure resources
 * and services. These tests provide a good level of confidence that our application is working, and
 * can be reasonably fast to complete.
 * https://www.webiny.com/docs/how-to-guides/scaffolding/extend-graphql-api#crudintegrationtestts
 */

const query = ({ query = "", variables = {} } = {}) => {
    return handler({
        httpMethod: "POST",
        headers: {},
        body: JSON.stringify({
            query,
            variables
        })
    }).then(response => JSON.parse(response.body));
};

let testNoticias = [];

describe("Noticias CRUD tests (integration)", () => {
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
                }).then(response => response.data.noticias.createNoticia)
            );
        }
    });

    afterEach(async () => {
        for (let i = 0; i < 3; i++) {
            await query({
                query: DELETE_NOTICIA,
                variables: {
                    id: testNoticias[i].id
                }
            });
        }
        testNoticias = [];
    });

    it("should be able to perform basic CRUD operations", async () => {
        // 1. Now that we have noticias created, let's see if they come up in a basic listNoticias query.
        const [noticia0, noticia1, noticia2] = testNoticias;

        await query({ query: LIST_NOTICIAS }).then(response =>
            expect(response.data.noticias.listNoticias).toEqual({
                data: [noticia2, noticia1, noticia0],
                meta: {
                    after: null,
                    before: null,
                    limit: 10
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
            query: LIST_NOTICIAS
        }).then(response =>
            expect(response.data.noticias.listNoticias).toEqual({
                data: [noticia2, noticia0],
                meta: {
                    after: null,
                    before: null,
                    limit: 10
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
            expect(response.data.noticias.updateNoticia).toEqual({
                id: noticia0.id,
                title: "Noticia 0 - UPDATED",
                description: `Noticia 0's description - UPDATED.`
            })
        );

        // 5. Get noticia 0 after the update.
        await query({
            query: GET_NOTICIA,
            variables: { id: noticia0.id }
        }).then(response =>
            expect(response.data.noticias.getNoticia).toEqual({
                id: noticia0.id,
                title: "Noticia 0 - UPDATED",
                description: `Noticia 0's description - UPDATED.`
            })
        );
    });

    test("should be able to use cursor-based pagination (desc)", async () => {
        const [noticia0, noticia1, noticia2] = testNoticias;

        await query({
            query: LIST_NOTICIAS,
            variables: {
                limit: 2
            }
        }).then(response =>
            expect(response.data.noticias.listNoticias).toEqual({
                data: [noticia2, noticia1],
                meta: {
                    after: noticia1.id,
                    before: null,
                    limit: 2
                }
            })
        );

        await query({
            query: LIST_NOTICIAS,
            variables: {
                limit: 2,
                after: noticia1.id
            }
        }).then(response =>
            expect(response.data.noticias.listNoticias).toEqual({
                data: [noticia0],
                meta: {
                    before: noticia0.id,
                    after: null,
                    limit: 2
                }
            })
        );

        await query({
            query: LIST_NOTICIAS,
            variables: {
                limit: 2,
                before: noticia0.id
            }
        }).then(response =>
            expect(response.data.noticias.listNoticias).toEqual({
                data: [noticia2, noticia1],
                meta: {
                    after: noticia1.id,
                    before: null,
                    limit: 2
                }
            })
        );
    });

    test("should be able to use cursor-based pagination (ascending)", async () => {
        const [noticia0, noticia1, noticia2] = testNoticias;

        await query({
            query: LIST_NOTICIAS,
            variables: {
                limit: 2,
                sort: "createdOn_ASC"
            }
        }).then(response =>
            expect(response.data.noticias.listNoticias).toEqual({
                data: [noticia0, noticia1],
                meta: {
                    after: noticia1.id,
                    before: null,
                    limit: 2
                }
            })
        );

        await query({
            query: LIST_NOTICIAS,
            variables: {
                limit: 2,
                sort: "createdOn_ASC",
                after: noticia1.id
            }
        }).then(response =>
            expect(response.data.noticias.listNoticias).toEqual({
                data: [noticia2],
                meta: {
                    before: noticia2.id,
                    after: null,
                    limit: 2
                }
            })
        );

        await query({
            query: LIST_NOTICIAS,
            variables: {
                limit: 2,
                sort: "createdOn_ASC",
                before: noticia2.id
            }
        }).then(response =>
            expect(response.data.noticias.listNoticias).toEqual({
                data: [noticia0, noticia1],
                meta: {
                    after: noticia1.id,
                    before: null,
                    limit: 2
                }
            })
        );
    });
});
