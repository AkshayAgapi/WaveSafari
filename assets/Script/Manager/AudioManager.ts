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

    private _isMuted: boolean = false;
    private _bgmEnabled: boolean = true;
    private _sfxEnabled: boolean = true;

    private static _instance: AudioManager;

    public static getInstance(): AudioManager {
        return AudioManager._instance;
    }

    public toggleAudio() : Boolean {
        this._isMuted = !this._isMuted;
        this.toggleSfx();
        this.toggleBgm();
        this.toggleWaveSfx();
        return this._isMuted;
    }

    protected onLoad(): void {

        if (AudioManager._instance) {
            this.node.destroy();
        } else {
            AudioManager._instance = this;
        }

        this.playWaveSfx();
    }

    public playSfx(soundClipType: SoundClipType) {
        if (!this._sfxEnabled)
            return
        const sound = this.GetSoundClip(soundClipType);
        if (sound) {
            this.sfxAudioSource.clip = sound;
            this.sfxAudioSource.play(); //playOneShot(sound);
        } else {
            console.log('Sound clip not found: ' + SoundClipType[soundClipType]);
        }
    }

    private playWaveSfx() {
        if (!this._sfxEnabled)
            return

        this.sfxWaveAudioSource.clip = this.waveAudio;
        this.sfxWaveAudioSource.loop = true;
        this.sfxWaveAudioSource.play();
    }

    public playBGM(soundClipType: SoundClipType) {
       if( this._forceBGMDisable ==true)
       {
            return;
       }
        const sound = this.GetSoundClip(soundClipType);
        if (sound ) {
            this.bgmAudioSource.clip = sound;
            if (this._bgmEnabled) {
            this.bgmAudioSource.play();
            }
        } else {
            console.log('Sound clip not found: ' + SoundClipType[soundClipType]);
        }
    }

    private GetSoundClip(clipType: SoundClipType): cc.AudioClip {
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

    public toggleBgm() {
        if( this._forceBGMDisable ==true)
        {
            return;
        }
        this._bgmEnabled = !this._bgmEnabled;
        if (this._bgmEnabled) {
            this.bgmAudioSource.play();
        } else {
            this.bgmAudioSource.pause();
        }
    }

    public toggleSfx() {
        this._sfxEnabled = !this._sfxEnabled;
    }

    public toggleWaveSfx() {
        if (this._sfxEnabled) {
            this.sfxWaveAudioSource.play();
        } else {
            this.sfxWaveAudioSource.pause();
        }
    }

    public disablGameBGM(){
        this._forceBGMDisable = true;
        this.bgmAudioSource.stop();
        this.bgmAudioSource.enabled = false;
    }

    public pauseAllSounds(){
        this.sfxAudioSource.pause();
        this.bgmAudioSource.pause();
        this.sfxWaveAudioSource.pause();
    }

    public resumeAllSounds()
    {
        if(this._sfxEnabled){
            this.sfxAudioSource.pause();
            this.sfxWaveAudioSource.pause();
        }

        if(this._bgmEnabled){
            this.bgmAudioSource.pause();
        }
    }
}
