const {ccclass, property} = cc._decorator;

export enum SoundClipType {
    GAMEPLAY_BGM,
    COLLISION_SFX,
    COIN_COLLECTION_SFX,
    FUEL_COLLECTION_SFX,
    WAVE_SFX,
    BUTTON_CLICK_SFX
}

@ccclass
export default class AudioManager extends cc.Component{

    _forceBGMDisable: boolean = false;

    @property(cc.AudioSource)
    sfxAudioSource: cc.AudioSource = null;

    @property(cc.AudioSource)
    sfxWaveAudioSource: cc.AudioSource = null;

    @property(cc.AudioSource)
    bgmAudioSource: cc.AudioSource = null;

    @property({ type: cc.AudioClip })
    bgmAudio: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    buttonAudio: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    collisionAudio: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    coinCollection: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    fuelCollection: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    waveAudio: cc.AudioClip = null;

    @property(cc.SpriteFrame)
    musicIcon: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    muteIcon: cc.SpriteFrame = null;

    private isMuted: boolean = false;

    private bgmEnabled: boolean = true;
    private sfxEnabled: boolean = true;

    private static instance: AudioManager;

    public static getInstance(): AudioManager {
        return AudioManager.instance;
    }

    toggleAudio() {
        this.isMuted = !this.isMuted;
      this.toggleSfx();
      this.toggleBgm();
    }

    protected onLoad(): void {

        if (AudioManager.instance) {
            this.node.destroy();
        } else {
            AudioManager.instance = this;
        }

        this.playWaveSfx();
    }

    playSfx(soundClipType: SoundClipType) {
        if (!this.sfxEnabled)
            return
        console.log('playSfx   called ');
        const sound = this.GetSoundClip(soundClipType);
        if (sound) {
            this.sfxAudioSource.clip = sound;
            this.sfxAudioSource.play(); //playOneShot(sound);
        } else {
            console.log('Sound clip not found: ' + SoundClipType[soundClipType]);
        }
    }

    playWaveSfx() {
        this.sfxWaveAudioSource.clip = this.waveAudio;
        this.sfxWaveAudioSource.loop = true;
        this.sfxWaveAudioSource.play();
    }

    playBGM(soundClipType: SoundClipType) {
       if( this._forceBGMDisable ==true)
       {
return;
       }
        console.log('playBGM   called ');
        const sound = this.GetSoundClip(soundClipType);
        if (sound ) {
            this.bgmAudioSource.clip = sound;
            if (this.bgmEnabled) {
            this.bgmAudioSource.play();
            }
        } else {
            console.log('Sound clip not found: ' + SoundClipType[soundClipType]);
        }
    }

    GetSoundClip(clipType: SoundClipType): cc.AudioClip {
        switch (clipType) {

            case SoundClipType.GAMEPLAY_BGM:
                return this.bgmAudio;

            case SoundClipType.COLLISION_SFX:
                return this.collisionAudio;

            case SoundClipType.COIN_COLLECTION_SFX:
                return this.coinCollection;

            case SoundClipType.FUEL_COLLECTION_SFX:
                return this.fuelCollection;

            case SoundClipType.BUTTON_CLICK_SFX:
                return this.buttonAudio;
        }
    }

    toggleBgm() {
        if( this._forceBGMDisable ==true)
        {
            return;
        }
        this.bgmEnabled = !this.bgmEnabled;
        if (this.bgmEnabled) {
            this.bgmAudioSource.play();
        } else {
            this.bgmAudioSource.stop();
        }
    }

    toggleSfx() {
        this.sfxEnabled = !this.sfxEnabled;
    }

    DisablGameBGM()
    {
        this._forceBGMDisable = true;
        this.bgmAudioSource.stop();
        this.bgmAudioSource.enabled = false;
    }
}
