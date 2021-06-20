/** Music.ts
 * Provides a list of music, for autoplay
 */

export interface MusicObject {
  title: string;
  url: string,

}

export const MusicList: MusicObject[] = [
  {
    title: 'Serenity',
    url: '/assets/music/serenity.mp3'
  },
  {
    title: 'Home',
    url: '/assets/music/home.mp3'
  },
  {
    title: 'Solitary',
    url: '/assets/music/solitary.mp3'
  }
]
