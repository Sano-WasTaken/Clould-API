import axios from "axios";
import { CONFIGURATION } from "./experience";
import { BASE_URL } from "../utils/urls";

interface PLACE_CONFIGURATION extends CONFIGURATION {
    PLACE_ID: string
}

export default class Place {
    constructor(configuration: PLACE_CONFIGURATION) {
        this._configuration = configuration;
    }

    private _configuration: PLACE_CONFIGURATION;

    private _getURLv1() {
        const { UNIVERSE_ID, PLACE_ID } = this._configuration

        return BASE_URL+`/universes/v1/${UNIVERSE_ID}/places/${PLACE_ID}/versions`
    }

    /**
     * @param cookie PLS DO NOT FORGET TO NOT SHOWING YOUR COOKIES WHEN YOU'RE CODING, YOU WILL REGRET IT...
     */
    public async getPlaceFile(cookie: string) {
        const { PLACE_ID } = this._configuration
        const url = `https://assetdelivery.roblox.com/v1/asset/?id=${PLACE_ID}`

        try {
            const headers = {
                'Cookie': `.ROBLOSECURITY=${cookie}`,
                'Content-Type': 'application/json',
            };

            const response = await axios.get(url, { headers, responseType: 'arraybuffer' });

            return Buffer.from(response.data)
        } catch (err) {
            console.error("Failed to download place file:", err)
        }
    }

    private _getParams(other: object) {
        const { UNIVERSE_ID, PLACE_ID } = this._configuration

        return {
            ...other,
            universeId: UNIVERSE_ID,
            placeId: PLACE_ID,
        }
    }

    public async publishPlace(file?: Buffer) {
        return await this.commitPlaceFromFile("Published", file)
    }

    public async commitPlaceFromFile(versionType: "Saved" | "Published", file?: Buffer) {
        try {
            const response = await axios.post<{versionNumber: number;}>(this._getURLv1(), file ?? {}, {
                headers: {
                    "x-api-key": this._configuration.API_KEY,
                    "Content-Type": "application/xml",
                    Accept: "application/json"
                },
                params: this._getParams({ versionType: versionType })
            })

            return response.data
        } catch (err) {
            console.error("Failed to commit place from file", err.response?.status)
        }
    }
}