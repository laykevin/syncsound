import { ISound, SCEvents, SCWidget, SoundOrigin, ToClientEvents } from 'shared';
import { IState, IStateContext } from '../types';

export class PlayerController {
  // @ts-ignore
  private readonly scEvents: SCEvents = window.SC.Widget.Events;
  private readonly elementId: string = 'ssplayer';
  private readonly scriptId: string = 'ssplayerScript';
  private readonly timeout: number = 250;
  private isYTPlayerAPIReady: boolean = false;
  private scPlayOriginal?: () => void;

  sound: ISound;
  setState: IStateContext['setState'];
  player: YT.Player | SCWidget | null = null;

  constructor(sound: ISound, setState: IStateContext['setState']) {
    this.sound = sound;
    this.setState = setState;
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
    if (event.data === YT.PlayerState.PLAYING)
      this.setState((prev) => {
        const playerStatus = { isPlaying: true, shouldEmit: !prev.playerStatus.isPlaying };
        this.logEvent('YT.PlayerState.PLAYING', prev, playerStatus);
        return { ...prev, playerStatus };
      });
    if (event.data === YT.PlayerState.PAUSED)
      this.setState((prev) => {
        const playerStatus = { isPlaying: false, shouldEmit: prev.playerStatus.isPlaying };
        this.logEvent('YT.PlayerState.PAUSED', prev, playerStatus);
        return { ...prev, playerStatus };
      });
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

    (<SCWidget>this.player).bind(this.scEvents.READY, () => {
      (<SCWidget>this.player).bind(this.scEvents.PLAY, () => {
        this.setState((prev) => {
          if (prev.playerStatus.isPlaying) {
            this.logEvent(this.scEvents.PLAY + ' (already playing)', prev, prev.playerStatus);
            return prev;
          }
          const playerStatus = { isPlaying: true, shouldEmit: !prev.playerStatus.isPlaying };
          this.logEvent(this.scEvents.PLAY, prev, playerStatus);
          return { ...prev, playerStatus };
        });
      });

      (<SCWidget>this.player).bind(this.scEvents.PAUSE, () => {
        this.setState((prev) => {
          const playerStatus = { isPlaying: false, shouldEmit: prev.playerStatus.isPlaying };
          this.logEvent(this.scEvents.PAUSE, prev, playerStatus);
          return { ...prev, playerStatus };
        });
      });
      // @ts-ignore
      window.ssplayer = this.player;
    });
  };

  // SHARED METHODS
  public play = (): void => {
    if (this.sound.origin === SoundOrigin.SC) {
      console.log('PlayerController.play (SC)');
      (<SCWidget>this.player).play();
    } else if (this.sound.origin === SoundOrigin.YT) {
      (<YT.Player>this.player).playVideo();
    }
  };

  public pause = (): void => {
    if (this.sound.origin === SoundOrigin.SC) {
      console.log('PlayerController.pause (SC)');
      (<SCWidget>this.player).pause();
    } else if (this.sound.origin === SoundOrigin.YT) {
      (<YT.Player>this.player).pauseVideo();
    }
  };

  public isPlayerPaused = (): Promise<boolean> => {
    if (!this.player) return Promise.resolve(false);
    if (this.sound.origin === SoundOrigin.SC) {
      return new Promise((res, rej) => {
        (<SCWidget>this.player).isPaused((result) => {
          if (typeof result !== 'boolean') {
            console.warn('isPlayerPaused (SC): Unexpected result', result);
            rej('Unexpected result');
          }
          console.log('isPlayerPaused (SC):', result);
          res(result);
        });
      });
    } else if (this.sound.origin === SoundOrigin.YT) {
      const playerState = (<YT.Player>this.player).getPlayerState();
      console.log('isPlayerPaused (YT):', playerState);
      return Promise.resolve(playerState !== YT.PlayerState.PLAYING);
    }
    return Promise.resolve(false);
  };

  private logEvent = (eventName: string, prevState: IState, playerStatus: IState['playerStatus']): void => {
    console.log('PlayerController Event:', this.sound.origin, eventName, prevState, playerStatus);
  };
}
