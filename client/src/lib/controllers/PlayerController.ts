import { ISound, SCWidget, SoundOrigin, ToClientEvents } from 'shared';

export class PlayerController {
  readonly elementId: string = 'ssplayer';
  readonly scriptId: string = 'ssplayerScript';
  readonly timeout: number = 250;
  sound: ISound;
  player: YT.Player | SCWidget | null = null;
  isYTPlayerAPIReady: boolean = false;

  constructor(sound: ISound) {
    this.sound = sound;
    document.addEventListener(ToClientEvents.ssplayerReady, this.onPlayerReady);
  }

  onPlayerReady = () => {
    this.isYTPlayerAPIReady = true;
    this.player = new YT.Player(this.elementId, {
      videoId: this.getYTVideoId(this.sound.src),
      events: {
        onReady: (event: YT.PlayerEvent) => {
          console.log('YTPlayerController: onPlayerReady', event);
        },
      },
    });
  };

  loadYTPlayerAPI = async (): Promise<boolean> => {
    this.isYTPlayerAPIReady = false;
    this.player = null;
    const existing = document.getElementById(this.scriptId);
    if (existing) existing.remove();

    const tag = document.createElement('script');
    tag.id = this.scriptId;
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    return new Promise((res, rej) => {
      console.log(
        'PlayerController.loadYTPlayerAPI: Loading YouTube Player API...',
        tag,
        firstScriptTag,
        this.isYTPlayerAPIReady
      );
      setTimeout(() => {
        if (this.isYTPlayerAPIReady && this.player) {
          console.log('PlayerController.loadYTPlayerAPI: Completed loading YouTube Player API!');
          res(true);
        } else {
          console.log('PlayerController.loadYTPlayerAPI: Waiting for YouTube Player API...');
          setTimeout(() => {
            if (this.isYTPlayerAPIReady && this.player) {
              console.log('PlayerController.loadYTPlayerAPI: Completed loading YouTube Player API! (2)');
              res(true);
            } else {
              console.warn('PlayerController.loadYTPlayerAPI: Could not load YouTube Player API');
              rej('timeout');
            }
          }, this.timeout);
        }
      }, this.timeout);
    });
  };

  getYTVideoId = (src: string): string => {
    const lastSlashIndex = src.lastIndexOf('/');
    if (lastSlashIndex < 0) {
      console.warn('getYTVideoId: Could not get YouTube video ID');
      return '';
    }
    return src.substring(lastSlashIndex + 1);
  };

  play = (): void => {
    if (this.sound.origin === SoundOrigin.SC) (<SCWidget>this.player).play();
    else (<YT.Player>this.player).playVideo();
  };

  pause = (): void => {
    if (this.sound.origin === SoundOrigin.SC) (<SCWidget>this.player).pause();
    else (<YT.Player>this.player).pauseVideo();
  };
}
