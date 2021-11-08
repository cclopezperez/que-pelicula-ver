export default /* GraphQL */ `
    type Slider {
        id: ID!
        title: String!
        description: String
        coverImage: String
        createdOn: DateTime!
        savedOn: DateTime!
    }

    input SliderCreateInput {
        title: String!
        description: String
        coverImage: String
    }

    input SliderUpdateInput {
        title: String
        description: String
        coverImage: String
    }

    type SlidersListMeta {
        limit: Number
        before: String
        after: String
    }

    enum SlidersListSort {
        createdOn_ASC
        createdOn_DESC
    }

    type SlidersList {
        data: [Slider]
        meta: SlidersListMeta
    }

    type SliderQuery {
        # Returns a single Slider entry.
        getSlider(id: ID!): Slider

        # Lists one or more Slider entries.
        listSliders(limit: Int, before: String, after: String, sort: SlidersListSort): SlidersList!
    }

    type SliderMutation {
        # Creates and returns a new Slider entry.
        createSlider(data: SliderCreateInput!): Slider!

        # Updates and returns an existing Slider entry.
        updateSlider(id: ID!, data: SliderUpdateInput!): Slider!

        # Deletes and returns an existing Slider entry.
        deleteSlider(id: ID!): Slider!
    }

    extend type Query {
        sliders: SliderQuery
    }

    extend type Mutation {
        sliders: SliderMutation
    }
`;
