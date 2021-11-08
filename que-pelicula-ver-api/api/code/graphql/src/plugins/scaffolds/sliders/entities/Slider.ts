// https://github.com/jeremydaly/dynamodb-toolbox
import { Entity } from "dynamodb-toolbox";
import table from "./table";
import { SliderEntity } from "../types";

/**
 * Once we have the table, we define the SliderEntity entity.
 * If needed, additional entities can be defined using the same approach.
 */
export default new Entity<SliderEntity>({
    table,
    name: "Slider",
    timestamps: false,
    attributes: {
        PK: { partitionKey: true },
        SK: { sortKey: true },
        id: { type: "string" },
        title: { type: "string" },
        description: { type: "string" },
        coverImage: { type: "string" },
        createdOn: { type: "string" },
        savedOn: { type: "string" },

        // Will store current version of Webiny, for example "5.9.1".
        // Might be useful in the future or while performing upgrades.
        webinyVersion: { type: "string" }
    }
});
