import { CONFIGURATION } from "./experience";

interface PLACE_CONFIGURATION extends CONFIGURATION {
    PLACE_ID: number
}

export default class Place {
    constructor(configuration: PLACE_CONFIGURATION) {

    }
}