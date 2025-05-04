import express, { Application, application } from "express";
import DataStore from "./datastores";
import Place from "./place";
import axios from "axios";

export interface CONFIGURATION {
  API_KEY: string;
  UNIVERSE_ID: string;
}

export default class Experience {
  constructor(configuration: CONFIGURATION) {
    this._configuration = configuration;
    this._app = express()
  }

  private _app: Application
  private _configuration: CONFIGURATION;

  public getDataStore(name: string, scope: string = "global") {
    return new DataStore({ ...this._configuration, NAME: name, SCOPE: scope });
  }

  public getPlace(placeId: string) {
    return new Place({...this._configuration, PLACE_ID: placeId})
  }

  public listen(port: number = 3000) {
    this._app.listen(port)
    console.log("[SERVER]: The express server is on your experience!")
  }

  public async restartServers() {
    const { UNIVERSE_ID, API_KEY } = this._configuration

    try {
      const response = await axios.post(`https://apis.roblox.com/cloud/v2/universes/${UNIVERSE_ID}:restartServers`, {}, {
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json"
        }
      })

      return response.data
    } catch (err) {
      console.error(err)
    }
  }

  public async updateUniverseForRestart() {
    const { UNIVERSE_ID, API_KEY } = this._configuration

    try {
      const response = await axios.post(`https://apis.roblox.com/cloud/v2/universes/${UNIVERSE_ID}`, {}, {
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json"
        },
        params: {
          updateMask: "{}"
        }
      })

      return response.data
    } catch (err) {
      console.error(err)
    }
  }

  public on(event: string, callback: (parent: Application) => void) {
    return this._app.on(event, callback)
  }

  public getApp() {
    return this._app
  }
}
