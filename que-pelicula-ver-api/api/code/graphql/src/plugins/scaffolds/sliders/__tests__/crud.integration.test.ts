import { handler } from "~/index";
import {
    GET_SLIDER,
    CREATE_SLIDER,
    DELETE_SLIDER,
    LIST_SLIDERS,
    UPDATE_SLIDER
} from "./graphql/sliders";

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

let testSliders = [];

describe("Sliders CRUD tests (integration)", () => {
    beforeEach(async () => {
        for (let i = 0; i < 3; i++) {
            testSliders.push(
                await query({
                    query: CREATE_SLIDER,
                    variables: {
                        data: {
                            title: `Slider ${i}`,
                            description: `Slider ${i}'s description.`
                        }
                    }
                }).then(response => response.data.sliders.createSlider)
            );
        }
    });

    afterEach(async () => {
        for (let i = 0; i < 3; i++) {
            await query({
                query: DELETE_SLIDER,
                variables: {
                    id: testSliders[i].id
                }
            });
        }
        testSliders = [];
    });

    it("should be able to perform basic CRUD operations", async () => {
        // 1. Now that we have sliders created, let's see if they come up in a basic listSliders query.
        const [slider0, slider1, slider2] = testSliders;

        await query({ query: LIST_SLIDERS }).then(response =>
            expect(response.data.sliders.listSliders).toEqual({
                data: [slider2, slider1, slider0],
                meta: {
                    after: null,
                    before: null,
                    limit: 10
                }
            })
        );

        // 2. Delete slider 1.
        await query({
            query: DELETE_SLIDER,
            variables: {
                id: slider1.id
            }
        });

        await query({
            query: LIST_SLIDERS
        }).then(response =>
            expect(response.data.sliders.listSliders).toEqual({
                data: [slider2, slider0],
                meta: {
                    after: null,
                    before: null,
                    limit: 10
                }
            })
        );

        // 3. Update slider 0.
        await query({
            query: UPDATE_SLIDER,
            variables: {
                id: slider0.id,
                data: {
                    title: "Slider 0 - UPDATED",
                    description: `Slider 0's description - UPDATED.`
                }
            }
        }).then(response =>
            expect(response.data.sliders.updateSlider).toEqual({
                id: slider0.id,
                title: "Slider 0 - UPDATED",
                description: `Slider 0's description - UPDATED.`
            })
        );

        // 5. Get slider 0 after the update.
        await query({
            query: GET_SLIDER,
            variables: { id: slider0.id }
        }).then(response =>
            expect(response.data.sliders.getSlider).toEqual({
                id: slider0.id,
                title: "Slider 0 - UPDATED",
                description: `Slider 0's description - UPDATED.`
            })
        );
    });

    test("should be able to use cursor-based pagination (desc)", async () => {
        const [slider0, slider1, slider2] = testSliders;

        await query({
            query: LIST_SLIDERS,
            variables: {
                limit: 2
            }
        }).then(response =>
            expect(response.data.sliders.listSliders).toEqual({
                data: [slider2, slider1],
                meta: {
                    after: slider1.id,
                    before: null,
                    limit: 2
                }
            })
        );

        await query({
            query: LIST_SLIDERS,
            variables: {
                limit: 2,
                after: slider1.id
            }
        }).then(response =>
            expect(response.data.sliders.listSliders).toEqual({
                data: [slider0],
                meta: {
                    before: slider0.id,
                    after: null,
                    limit: 2
                }
            })
        );

        await query({
            query: LIST_SLIDERS,
            variables: {
                limit: 2,
                before: slider0.id
            }
        }).then(response =>
            expect(response.data.sliders.listSliders).toEqual({
                data: [slider2, slider1],
                meta: {
                    after: slider1.id,
                    before: null,
                    limit: 2
                }
            })
        );
    });

    test("should be able to use cursor-based pagination (ascending)", async () => {
        const [slider0, slider1, slider2] = testSliders;

        await query({
            query: LIST_SLIDERS,
            variables: {
                limit: 2,
                sort: "createdOn_ASC"
            }
        }).then(response =>
            expect(response.data.sliders.listSliders).toEqual({
                data: [slider0, slider1],
                meta: {
                    after: slider1.id,
                    before: null,
                    limit: 2
                }
            })
        );

        await query({
            query: LIST_SLIDERS,
            variables: {
                limit: 2,
                sort: "createdOn_ASC",
                after: slider1.id
            }
        }).then(response =>
            expect(response.data.sliders.listSliders).toEqual({
                data: [slider2],
                meta: {
                    before: slider2.id,
                    after: null,
                    limit: 2
                }
            })
        );

        await query({
            query: LIST_SLIDERS,
            variables: {
                limit: 2,
                sort: "createdOn_ASC",
                before: slider2.id
            }
        }).then(response =>
            expect(response.data.sliders.listSliders).toEqual({
                data: [slider0, slider1],
                meta: {
                    after: slider1.id,
                    before: null,
                    limit: 2
                }
            })
        );
    });
});
