import express, { Application, application } from "express";
import DataStore from "./datastores";

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

  public listen(port: number = 3000) {
    this._app.listen(port)
    console.log("[SERVER]: the express server is on your experience!")
  }

  public on(event: string, callback: (parent: Application) => void) {
    return this._app.on(event, callback)
  }

  public getApp() {
    return this._app
  }
}
