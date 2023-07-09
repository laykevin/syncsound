import { ISound, SCEvents, SCWidget, SoundOrigin, ToClientEvents } from 'shared';
import { MergeState } from '../types';

export class PlayerController {
  // @ts-ignore
  private readonly scEvents: SCEvents = window.SC.Widget.Events;
  private readonly elementId: string = 'ssplayer';
  private readonly scriptId: string = 'ssplayerScript';
  private readonly timeout: number = 250;

  sound: ISound;
  mergeState: MergeState;
  player: YT.Player | SCWidget | null = null;
  isYTPlayerAPIReady: boolean = false;

  constructor(sound: ISound, mergeState: MergeState) {
    this.sound = sound;
    this.mergeState = mergeState;
    if (sound.origin === SoundOrigin.SC) {
      this.player = window.SC.Widget(this.elementId);
      this.loadSCWidget();
    } else if (sound.origin === SoundOrigin.YT) {
      document.removeEventListener(ToClientEvents.ssplayerReady, this.onPlayerReady);
      document.addEventListener(ToClientEvents.ssplayerReady, this.onPlayerReady);
      this.loadYTPlayerAPI();
    }
  }

  // YOUTUBE METHODS
  private onPlayerReady = (): void => {
    this.isYTPlayerAPIReady = true;
    this.player = new YT.Player(this.elementId, {
      videoId: this.getYTVideoId(this.sound.src),
      playerVars: {
        autoplay: 0,
        // controls: 0,
        enablejsapi: 1,
        fs: 0,
      },
      events: {
        onReady: (event: YT.PlayerEvent) => console.log('(YT): onReady', event, event.target),
        onStateChange: this.onStateChange,
      },
    });
  };

  private onStateChange = (event: YT.OnStateChangeEvent): void => {
    if (event.data === YT.PlayerState.PLAYING) this.mergeState({ isPlaying: true });
    if (event.data === YT.PlayerState.PAUSED) this.mergeState({ isPlaying: false });
  };

  private loadYTPlayerAPI = (): void => {
    if (this.sound.origin !== SoundOrigin.YT) return;
    this.isYTPlayerAPIReady = false;
    this.player = null;
    const existing = document.getElementById(this.scriptId);
    if (existing) existing.remove();

    const tag = document.createElement('script');
    tag.id = this.scriptId;
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    console.log('loadYTPlayerAPI: Loading YouTube Player API...', tag, firstScriptTag);
    console.time('loadYTPlayerAPI');

    setTimeout(() => {
      if (this.isYTPlayerAPIReady && this.player)
        console.log('loadYTPlayerAPI: Completed loading YouTube Player API!', this.player, this.sound);
      else {
        console.log('loadYTPlayerAPI: Waiting for YouTube Player API...');
        setTimeout(() => {
          if (this.isYTPlayerAPIReady && this.player)
            console.log('loadYTPlayerAPI: Completed loading YouTube Player API! (2)', this.player, this.sound);
          else console.warn('loadYTPlayerAPI: Could not load YouTube Player API');
        }, this.timeout);
      }
    }, this.timeout);
  };

  private getYTVideoId = (src: string): string => {
    const lastSlashIndex = src.lastIndexOf('/');
    if (lastSlashIndex < 0) {
      console.warn('getYTVideoId: Could not get YouTube video ID');
      return '';
    }
    return src.substring(lastSlashIndex + 1);
  };

  // SOUNDCLOUD METHODS
  private loadSCWidget = (): void => {
    if (!this.player || this.sound.origin !== SoundOrigin.SC) return;
    (<SCWidget>this.player).bind(this.scEvents.PLAY, () => this.mergeState({ isPlaying: true }));
    (<SCWidget>this.player).bind(this.scEvents.PAUSE, () => this.mergeState({ isPlaying: false }));
  };

  // SHARED METHODS
  public play = (): void => {
    if (this.sound.origin === SoundOrigin.SC) {
      (<SCWidget>this.player).play();
      this.mergeState({ isPlaying: true });
    } else if (this.sound.origin === SoundOrigin.YT) {
      (<YT.Player>this.player).playVideo();
      this.mergeState({ isPlaying: true });
    }
  };

  public pause = (): void => {
    if (this.sound.origin === SoundOrigin.SC) {
      (<SCWidget>this.player).pause();
      this.mergeState({ isPlaying: false });
    } else if (this.sound.origin === SoundOrigin.YT) {
      (<YT.Player>this.player).pauseVideo();
      this.mergeState({ isPlaying: false });
    }
  };
}
