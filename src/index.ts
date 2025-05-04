import Experience from "./requesters/experience";
import friend from "./easter.json";
import { config } from "dotenv";
import id from "./utils/ids/id";
import techIsland from "./private/tech-island";

// you should not use those testing htigs, write your own things.

config()

techIsland.listen()
const app = techIsland.getApp()

const opencloudds = techIsland.getDataStore("opencloud");

opencloudds.update("testentry", (old) => {
    if (old.value && (JSON.stringify(old.value) === JSON.stringify(friend))) return

    console.log("[SERVER]: The latest easter msg has been updated")
    old.value = friend;

    return old;
});

app.post("/publish", (req, res) => {
    console.log(req.ips, req.ip)
    techIsland.publishPlaces().then(() => console.log("[SERVER]: All the changes are successfully done."))
    res.status(200).send()
})

app.get("/ping", (req, res) => {
    res.status(200).send()
})

app.post("/profiles/delete/all", (req, res) => {
    techIsland.deleteProfiles(true).then(() => console.log("[SERVER]: All profiles are cleared."))
    res.status(200).send()
})

//



//techIsland.globalDataStore.listKeys(100).then(console.log)

//id.insertMajorId(true, 5428121885).then(() => console.log("This id is in the whitelist now."));