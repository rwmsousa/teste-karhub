import axios from 'axios';

interface Track {
  name: string;
  artist: string;
  link: string;
}

interface Playlist {
  name: string;
  tracks: Track[];
}

export class SpotifyService {
  private readonly baseUrl = 'https://api.spotify.com/v1';
  private readonly clientId = process.env.SPOTIFY_CLIENT_ID;
  private readonly clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  private accessToken: string | null = null;

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    if (!this.clientId || !this.clientSecret) {
      throw new Error('Spotify credentials not found');
    }

    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${this.clientId}:${this.clientSecret}`,
          ).toString('base64')}`,
        },
      },
    );

    const token = response.data.access_token;
    if (!token) {
      throw new Error('Failed to get access token');
    }

    this.accessToken = token;
    return token;
  }

  async searchPlaylist(query: string): Promise<Playlist | null> {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(`${this.baseUrl}/search`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: query,
          type: 'playlist',
          limit: 1,
        },
      });

      const playlist = response.data.playlists.items[0];
      if (!playlist) return null;

      const tracksResponse = await axios.get(
        `${this.baseUrl}/playlists/${playlist.id}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            limit: 10,
          },
        },
      );

      const tracks = tracksResponse.data.items.map((item: any) => ({
        name: item.track.name,
        artist: item.track.artists[0].name,
        link: item.track.external_urls.spotify,
      }));

      return {
        name: playlist.name,
        tracks,
      };
    } catch (error) {
      console.error('Error searching playlist:', error);
      return null;
    }
  }
}
