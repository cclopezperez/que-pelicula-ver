import { SliderEntity } from "../types";
import mdbid from "mdbid";
import { Slider } from "../entities";
import SlidersResolver from "./SlidersResolver";

/**
 * Contains base `createSlider`, `updateSlider`, and `deleteSlider` GraphQL resolver functions.
 * Feel free to adjust the code to your needs. Also, note that at some point in time, you will
 * most probably want to implement custom data validation and security-related checks.
 * https://www.webiny.com/docs/how-to-guides/scaffolding/extend-graphql-api#essential-files
 */

interface CreateSliderParams {
    data: {
        title: string;
        description?: string;
    };
}

interface UpdateSliderParams {
    id: string;
    data: {
        title: string;
        description?: string;
    };
}

interface DeleteSliderParams {
    id: string;
}

interface SlidersMutation {
    createSlider(params: CreateSliderParams): Promise<SliderEntity>;
    updateSlider(params: UpdateSliderParams): Promise<SliderEntity>;
    deleteSlider(params: DeleteSliderParams): Promise<SliderEntity>;
}

/**
 * To define our GraphQL resolvers, we are using the "class method resolvers" approach.
 * https://www.graphql-tools.com/docs/resolvers#class-method-resolvers
 */
export default class SlidersMutation extends SlidersResolver implements SlidersMutation {
    /**
     * Creates and returns a new Slider entry.
     * @param data
     */
    async createSlider({ data }: CreateSliderParams) {
        // We use `mdbid` (https://www.npmjs.com/package/mdbid) library to generate
        // a random, unique, and sequential (sortable) ID for our new entry.
        const id = mdbid();

        const slider = {
            ...data,
            PK: this.getPK(),
            SK: id,
            id,
            createdOn: new Date().toISOString(),
            savedOn: new Date().toISOString(),
            webinyVersion: process.env.WEBINY_VERSION
        };

        // Will throw an error if something goes wrong.
        await Slider.put(slider);

        return slider;
    }

    /**
     * Updates and returns an existing Slider entry.
     * @param id
     * @param data
     */
    async updateSlider({ id, data }: UpdateSliderParams) {
        // If entry is not found, we throw an error.
        const { Item: slider } = await Slider.get({ PK: this.getPK(), SK: id });
        if (!slider) {
            throw new Error(`Slider "${id}" not found.`);
        }

        const updatedSlider = { ...slider, ...data };

        // Will throw an error if something goes wrong.
        await Slider.update(updatedSlider);

        return updatedSlider;
    }

    /**
     * Deletes and returns an existing Slider entry.
     * @param id
     */
    async deleteSlider({ id }: DeleteSliderParams) {
        // If entry is not found, we throw an error.
        const { Item: slider } = await Slider.get({ PK: this.getPK(), SK: id });
        if (!slider) {
            throw new Error(`Slider "${id}" not found.`);
        }

        // Will throw an error if something goes wrong.
        await Slider.delete(slider);

        return slider;
    }
}
