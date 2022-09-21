import axios from 'axios';
import * as bungie from 'bungie-api-ts/user';
import * as destiny2 from 'bungie-api-ts/destiny2';

enum DestinyComponentType {
    None = 0,
    Profiles = 100,
    VendorReceipts = 101,
    ProfileInventories = 102,
    ProfileCurrencies = 103,
    ProfileProgression = 104,
    PlatformSilver = 105,
    Characters = 200,
    CharacterInventories = 201,
    CharacterProgressions = 202,
    CharacterRenderData = 203,
    CharacterActivities = 204,
    CharacterEquipment = 205,
    ItemInstances = 300,
    ItemObjectives = 301,
    ItemPerks = 302,
    ItemRenderData = 303,
    ItemStats = 304,
    ItemSockets = 305,
    ItemTalentGrids = 306,
    ItemCommonData = 307,
    ItemPlugStates = 308,
    ItemPlugObjectives = 309,
    ItemReusablePlugs = 310,
    Vendors = 400,
    VendorCategories = 401,
    VendorSales = 402,
    Kiosks = 500,
    CurrencyLookups = 600,
    PresentationNodes = 700,
    Collectibles = 800,
    Records = 900,
    Transitory = 1000,
    Metrics = 1100,
    StringVariables = 1200,
    Craftables = 1300
}

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
        return await axios.get(this.api + `/${membershipType}/Profile/${membershipId}/LinkedProfiles/`, { params: { getAllMemberships }}).then(res => res.data);
    }

    async getProfile(membershipId: string, membershipType: bungie.BungieMembershipType, components: DestinyComponentType[] = []): Promise<destiny2.DestinyProfileResponse> {
        if (components.length === 0) {
            let enumVals: number[] = [];

            for (let comp in DestinyComponentType) {
                if (typeof comp === 'number') {
                    enumVals.push(comp);
                }
            }

            components = enumVals;
        }

        return await axios.get(this.api + `/${membershipType}/Profile/${membershipId}/`, { params: { components: components.join(',')}});
    }

    async getCharacter() {

    }

    async getClanWeeklyRewardState() {

    }

    async getClanBannerSource() {

    }

    async getItem() {

    }

    async getVendors() {

    }

    async getVendor() {

    }

    async getPublicVendors() {

    }

    async getCollectibleNodeDetails() {

    }

    async transferItem() {

    }

    async pullFromPostmaster() {

    }

    async equipItem() {

    }

    async equipItems() {

    }

    async setItemLockState() {

    }

    async setQuestTrackedState() {

    }



}