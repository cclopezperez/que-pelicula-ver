import {
    GET_SLIDER,
    CREATE_SLIDER,
    DELETE_SLIDER,
    LIST_SLIDERS,
    UPDATE_SLIDER
} from "./graphql/sliders";
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

let testSliders = [];

describe("Sliders CRUD tests (end-to-end)", () => {
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
                }).then(response => response.sliders.createSlider)
            );
        }
    });

    afterEach(async () => {
        for (let i = 0; i < 3; i++) {
            try {
                await query({
                    query: DELETE_SLIDER,
                    variables: {
                        id: testSliders[i].id
                    }
                });
            } catch {
                // Some of the entries might've been deleted during runtime.
                // We can ignore thrown errors.
            }
        }
        testSliders = [];
    });

    it("should be able to perform basic CRUD operations", async () => {
        // 1. Now that we have sliders created, let's see if they come up in a basic listSliders query.
        const [slider0, slider1, slider2] = testSliders;

        await query({
            query: LIST_SLIDERS,
            variables: { limit: 3 }
        }).then(response =>
            expect(response.sliders.listSliders).toMatchObject({
                data: [slider2, slider1, slider0],
                meta: {
                    limit: 3
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
            query: LIST_SLIDERS,
            variables: {
                limit: 2
            }
        }).then(response =>
            expect(response.sliders.listSliders).toMatchObject({
                data: [slider2, slider0],
                meta: {
                    limit: 2
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
            expect(response.sliders.updateSlider).toEqual({
                id: slider0.id,
                title: "Slider 0 - UPDATED",
                description: `Slider 0's description - UPDATED.`
            })
        );

        // 4. Get slider 0 after the update.
        await query({
            query: GET_SLIDER,
            variables: {
                id: slider0.id
            }
        }).then(response =>
            expect(response.sliders.getSlider).toEqual({
                id: slider0.id,
                title: "Slider 0 - UPDATED",
                description: `Slider 0's description - UPDATED.`
            })
        );
    });
});
