/**
 * Contains all of the GraphQL queries and mutations that we might need while writing our tests.
 * If needed, feel free to add more.
 */

export const GET_SLIDER = /* GraphQL */ `
    query GetSlider($id: ID!) {
        sliders {
            getSlider(id: $id) {
                id
                title
                description
            }
        }
    }
`;

export const CREATE_SLIDER = /* GraphQL */ `
    mutation CreateSlider($data: SliderCreateInput!) {
        sliders {
            createSlider(data: $data) {
                id
                title
                description
            }
        }
    }
`;

export const UPDATE_SLIDER = /* GraphQL*/ `
    mutation UpdateSlider($id: ID!, $data: SliderUpdateInput!) {
        sliders {
            updateSlider(id: $id, data: $data) {
                id
                title
                description
            }
        }
    }
`;

export const DELETE_SLIDER = /* GraphQL */ `
    mutation DeleteSlider($id: ID!) {
        sliders {
            deleteSlider(id: $id) {
                id
                title
                description
            }
        }
    }
`;

export const LIST_SLIDERS = /* GraphQL */ `
    query ListSliders($sort: SlidersListSort, $limit: Int, $after: String) {
        sliders {
            listSliders(sort: $sort, limit: $limit, after: $after) {
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
