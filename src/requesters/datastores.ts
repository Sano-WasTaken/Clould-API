import axios from "axios";
import  { CONFIGURATION } from "./experience";
import { BASE_URL } from "../utils/urls";
import { KEYINFO } from "../utils/interfaces/datastores";



interface DATASTORE_CONFIGURATION extends CONFIGURATION {
  NAME: string;
  SCOPE: string;
}

export default class DataStore {
  constructor(configuration: DATASTORE_CONFIGURATION) {
    this._configuration = configuration;
  }

  private _configuration: DATASTORE_CONFIGURATION;

  private _getHeaders() {
    return {
      "x-api-key": this._configuration.API_KEY,
      "Content-Type": "application/json",
    };
  }

  private _getParams(key: string) {
    const { NAME, SCOPE } = this._configuration;

    return {
      datastoreName: NAME,
      scope: SCOPE,
      entryKey: key,
    };
  }

  private _getURL(key?: string) {
    const { NAME, UNIVERSE_ID } = this._configuration;

    if (key) {
      return (
        BASE_URL +
        `/cloud/v2/universes/${UNIVERSE_ID}/data-stores/${NAME}/entries/${key}`
      );
    }

    return (
      BASE_URL +
      `/cloud/v2/universes/${UNIVERSE_ID}/data-stores/${NAME}/entries`
    );
  }

  public async get<T = unknown>(key: string): Promise<KEYINFO<T> | null> {
    try {
      const response = await axios.get(this._getURL(key), {
        headers: this._getHeaders(),
        params: this._getParams(key),
      });

      return response.data as KEYINFO<T>;
    } catch (error) {
      console.error(
        "Failed to get entry:",
        error.response?.status,
        error.response?.data,
      );

      return null;
    }
  }

  public async set<T = unknown>(
    key: string,
    data: T,
    users?: string[],
    attribute?: object,
  ): Promise<KEYINFO<T> | null> {
    try {
      const info: Partial<KEYINFO<T>> = {
        etag: "*",
        value: data,
        users: users,
        attributes: attribute,
      };

      const response = await axios.post(this._getURL(), info, {
        headers: this._getHeaders(),
        params: { id: key },
      });

      return response.data as KEYINFO<T>;
    } catch (error) {
      console.error(
        "Failed to set entry:",
        error.response?.status,
        error.response?.data,
      );

      return null;
    }
  }

  public async update<T = unknown>(
    key: string,
    update: (oldData: {
      users: string[];
      attributes: object;
      value?: T;
    }) => Partial<KEYINFO<T>> | undefined,
  ): Promise<KEYINFO<T> | null> {
    let oldData: {
      users: string[];
      attributes: object;
      value?: T;
    };

    try {
      oldData = await this.get(key);
    } catch (_) {
      console.warn("SafePatch: GET failed, continuing with fallback etag '*'");
    }

    oldData = oldData ?? {
      users: [],
      attributes: {},
    };

    try {
      const info: Partial<KEYINFO<T>> = update(oldData);

      if (!info) return null;

      const response = await axios.patch(this._getURL(key), info, {
        headers: this._getHeaders(),
        params: { allowMissing: true },
      });

      return response.data as KEYINFO<T>;
    } catch (error) {
      console.error(
        "Failed to update entry:",
        error.response?.status,
        error.response?.data,
      );

      return null;
    }
  }

  public async delete(key: string) {
    try {
      await axios.delete(this._getURL(key), {
        headers: this._getHeaders(),
      });
    } catch (error) {
      console.error(
        "Failed to delete entry:",
        error.response?.status,
        error.response.data,
      );

      return null;
    }
  }
}
