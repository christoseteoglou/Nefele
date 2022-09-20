import axios from 'axios';
import * as bungie from 'bungie-api-ts/user';
import * as destiny2 from 'bungie-api-ts/destiny2';

interface DestinyAPIOptions {
    apiKey: string;
    oauthID?: string;
    oauthSecret?: string;
}

const DEFAULT_DESTINY_API_OPTIONS: DestinyAPIOptions = {
    apiKey: '',
    oauthID: null,
    oauthSecret: null
};

export class DestinyAPI {
    host: string = 'https://www.bungie.net';
    path: string = '/Platform/Destiny2';
    api: string = this.host + this.path;

    apiKey: string;
    oauthID: string;
    oauthSecret: string;

    constructor(config: DestinyAPIOptions) {
        config = { ...DEFAULT_DESTINY_API_OPTIONS, ...config };

        this.apiKey = config.apiKey;
        this.oauthID = config.oauthID;
        this.oauthSecret = config.oauthSecret;

        axios.defaults.headers.common = {
            'X-API-Key': this.apiKey
        };
    }

    async getManifest(): Promise<destiny2.DestinyManifest> {
        return await axios.get(this.api + '/Manifest/').then((res) => res.data);
    }

    async getDestinyEntityDefinition(typeDefinition: string, hashIdentifier: string): Promise<destiny2.DestinyDefinition> {
        return await axios.get(this.api + `/Manifest/${typeDefinition}/${hashIdentifier}`).then((res) => res.data);
    }

    async searchDestinyPlayerByBungieName(membershipType: bungie.BungieMembershipType, displayName: string, displayNameCode: number): Promise<bungie.UserInfoCard[]> {
        return await axios.post(this.api + `/SearchDestinyPlayerByBungieName/${membershipType}`, {
            displayName,
            displayNameCode
        }).then(res => res.data);
    }

    async getLinkedProfiles(membershipType: bungie.BungieMembershipType, membershipId: string, getAllMemberships: boolean = true): Promise<destiny2.DestinyLinkedProfilesResponse> {
        return await axios.get(this.api + `/${membershipType}/Profile/${membershipId}`, { params: { getAllMemberships }}).then(res => res.data);
    }


}