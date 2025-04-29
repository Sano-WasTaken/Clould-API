import Experience from "./requesters/experience";
import friend from "./easter.json";
import { config } from "dotenv";

config()
const API_KEY = process.env.API_KEY;
const UNIVERSE_ID = process.env.UNIVERSE_ID;
const DONOR_PLACE_ID = process.env.DONOR_PLACE_ID
/**
 * DO NOT SHARE YOUR FREAKING COOKIES YOU DUMB ASS.
 */
const ROBLOX_SECURITY = process.env.ROBLOX_SECURITY

const experience = new Experience({
  API_KEY: API_KEY,
  UNIVERSE_ID: UNIVERSE_ID,
});

experience.listen()

const opencloudds = experience.getDataStore("opencloud");

opencloudds.update("testentry", (old) => {
    if (old.value && (JSON.stringify(old.value) === JSON.stringify(friend))) return

    console.log("[SERVER]: the latest easter msg has been updated")
    old.value = friend;

    return old;
});