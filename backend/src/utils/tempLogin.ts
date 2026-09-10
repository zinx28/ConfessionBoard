// Whats this? we dont really want to create accounts for every user who uses this, unless they dont need ab oard then yapypa ykyk
// this generated token only has view, comment permission to boards, creating and more is not permitted

type Tempusers = {
  Token: string;
  Username: string;
  updatedSince: Date;
};

type CacheDictionary = { [DiscordID: string]: Tempusers };
export const GlobalCacheProfiles: CacheDictionary = {};

export async function getProfileData(token: string): Promise<Tempusers | null>;
export async function getProfileData(
  token: string,
  withId: true
): Promise<[string, Tempusers] | null>;
export async function getProfileData(
  token: string,
  withId = false
): Promise<Tempusers | [string, Tempusers] | null> {
  for (const [DiscordID, profile] of Object.entries(GlobalCacheProfiles)) {
    if (profile.Token === token) {
      profile.updatedSince = new Date(Date.now() + 15 * 60 * 1000);
      return withId ? [DiscordID, profile] : profile;
    }
  }

  return null;
}

export async function getProfileDataByDscID(
  discordID: string
): Promise<Tempusers | null> {
  for (const [DiscordID, profile] of Object.entries(GlobalCacheProfiles)) {
    if (DiscordID === discordID) {
      profile.updatedSince = new Date(Date.now() + 15 * 60 * 1000);
      return profile;
    }
  }

  return null;
}
