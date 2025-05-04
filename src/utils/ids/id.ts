import axios from "axios"
import { ISODateString } from "../interfaces/datastores"
import editJsonFile, { JsonEditor } from "edit-json-file"

const majorFile = editJsonFile(`${__dirname}/major.json`)

interface USER_INFO {
  "description": string,
  "created": ISODateString,
  "isBanned": true,
  "externalAppDisplayName": string,
  "hasVerifiedBadge": boolean,
  "id": number,
  "name": string,
  "displayName": string
}

function getURL() {
    return "https://users.roblox.com"
}

class IdManager {
    public async getUserInfo(id: number) {
        try {
            const response = await axios.get<USER_INFO>(getURL()+`/v1/users/${id}`, {
                params: {
                    userId: id
                }
            })

            return response.data
        } catch(err) {
            //console.error(err.response)
            return null
        }
    }

    public getGlobalWhitelist() {
        const list: number[] = [...majorFile.get("whitelist")]

        return list
    }

    public getMajorWhitelist() {
        const list: number[] = [...majorFile.get("whitelist")]

        return list
    }

    public getGlobalBlacklist() {
        const list: number[] = [...majorFile.get("blacklist")]

        return list
    }

    public getMajorBlacklist() {
        const list: number[] = [...majorFile.get("blacklist")]

        return list
    }

    public async insertIdInFile(file: JsonEditor, whitelisted: boolean = true, id: number) {
        const response = await this.getUserInfo(id);

        if (!response) console.error("This id is not valid.");

        const part = whitelisted ? "whitelist" : "blacklist";

        const partArr = file.get(part)
        const set = new Set(partArr)

        if (set.has(id)) {
            console.warn("This id is already in this " + part + ".")
            return false;
        }

        majorFile.append(part, id)
        majorFile.save()
        console.log(majorFile.toObject())

        return true
    }

    public async insertMajorId(whitelisted: boolean = true, id: number) {
        return await this.insertIdInFile(majorFile, whitelisted, id)
    }
}

export = new IdManager()