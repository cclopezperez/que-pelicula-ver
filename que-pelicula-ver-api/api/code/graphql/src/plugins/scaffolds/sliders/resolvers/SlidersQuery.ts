import { SliderEntity } from "../types";
import { Slider } from "../entities";
import SlidersResolver from "./SlidersResolver";

/**
 * Contains base `getSlider` and `listSliders` GraphQL resolver functions.
 * Feel free to adjust the code to your needs. Also, note that at some point in time, you will
 * most probably want to implement security-related checks.
 * https://www.webiny.com/docs/how-to-guides/scaffolding/extend-graphql-api#essential-files
 */

interface GetSliderParams {
    id: string;
}

interface ListSlidersParams {
    sort?: "createdOn_ASC" | "createdOn_DESC";
    limit?: number;
    after?: string;
    before?: string;
}

interface ListSlidersResponse {
    data: SliderEntity[];
    meta: { limit: number; after: string; before: string };
}

interface SlidersQuery {
    getSlider(params: GetSliderParams): Promise<SliderEntity>;
    listSliders(params: ListSlidersParams): Promise<ListSlidersResponse>;
}

/**
 * To define our GraphQL resolvers, we are using the "class method resolvers" approach.
 * https://www.graphql-tools.com/docs/resolvers#class-method-resolvers
 */
export default class SlidersQuery extends SlidersResolver implements SlidersQuery {
    /**
     * Returns a single Slider entry from the database.
     * @param id
     */
    async getSlider({ id }: GetSliderParams) {
        // Query the database and return the entry. If entry was not found, an error is thrown.
        const { Item: slider } = await Slider.get({ PK: this.getPK(), SK: id });
        if (!slider) {
            throw new Error(`Slider "${id}" not found.`);
        }

        return slider;
    }

    /**
     * List multiple Slider entries from the database.
     * Supports basic sorting and cursor-based pagination.
     * @param limit
     * @param sort
     * @param after
     * @param before
     */
    async listSliders({ limit = 10, sort, after, before }: ListSlidersParams) {
        const PK = this.getPK();
        const query = { limit, reverse: sort !== "createdOn_ASC", gt: undefined, lt: undefined };
        const meta = { limit, after: null, before: null };

        // The query is constructed differently, depending on the "before" or "after" values.
        if (before) {
            query.reverse = !query.reverse;
            if (query.reverse) {
                query.lt = before;
            } else {
                query.gt = before;
            }

            const { Items } = await Slider.query(PK, { ...query, limit: limit + 1 });

            const data = Items.slice(0, limit).reverse();

            const hasBefore = Items.length > limit;
            if (hasBefore) {
                meta.before = Items[Items.length - 1].id;
            }

            meta.after = Items[0].id;

            return { data, meta };
        }

        if (after) {
            if (query.reverse) {
                query.lt = after;
            } else {
                query.gt = after;
            }
        }

        const { Items } = await Slider.query(PK, { ...query, limit: limit + 1 });

        const data = Items.slice(0, limit);

        const hasAfter = Items.length > limit;
        if (hasAfter) {
            meta.after = Items[limit - 1].id;
        }

        if (after) {
            meta.before = Items[0].id;
        }

        return { data, meta };
    }
}
