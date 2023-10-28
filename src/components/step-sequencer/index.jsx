import { Component } from "react";
import kick from "../../assets/samples/kick.wav";
import snare from "../../assets/samples/snare.wav";
import clap from "../../assets/samples/clap.wav";
import openHat from "../../assets/samples/hihat_open.wav";
import closedHat from "../../assets/samples/hihat_closed.wav";
import bass from "../../assets/samples/bass.wav";
import { Howler, Howl } from "howler";

class StepSequencer extends Component {
    constructor(){
        super()
        this.state = {
            playing: false,
            currentStep: 0,
            sequences: [
                {sound : new Howl({ src: [kick], volume: 1}), steps: [], name: 'Kick',id: '1', volume: 100, decay: 600},
                {sound : new Howl({ src: [snare], volume: 1}), steps: [], name: 'Snare',id: '2', volume: 100, decay: 1300},
                {sound : new Howl({ src: [clap], volume: 1}), steps: [], name: 'Clap',id: '3', volume: 100, decay: 1300},
                {sound : new Howl({ src: [openHat], volume: 1}), steps: [], name: 'Open Hat',id: '4', volume: 100, decay: 1300},
                {sound : new Howl({ src: [closedHat], volume: 1}), steps: [], name: 'Closed Hat',id: '5', volume: 100, decay: 1300},
                {sound : new Howl({ src: [bass], volume: 1}), steps: [], name: 'Bass',id: '6', volume: 100, decay: 300}
            ],
            numSteps: 16,
            bpm: 120,
            globalVolume: 100,
            mute: false,
        };

        this.state.sequences.forEach((sequence)=>{
            sequence.steps = new Array(this.state.numSteps).fill(false);
            sequence.sound.volume(sequence.volume);
        });
    }

    componentWillUnmount() {
        this.state.sequences.forEach((sequence =>{
            if (sequence.sound) {
                sequence.sound.unload();
            }            
        }));
    }
    
    trySound = (lineIndex) => {
        const sequences = this.state.sequences
        const decay = sequences[lineIndex].decay
        const currentVolume = (sequences[lineIndex].volume/100) 
        sequences[lineIndex].sound.play();
        sequences[lineIndex].sound.fade(currentVolume, 0.0, decay);
    }


    toggleStep = (lineIndex, stepIndex) => {
        const newSequences = [...this.state.sequences];
        newSequences[lineIndex].steps[stepIndex] = !newSequences[lineIndex].steps[stepIndex];
        this.setState({ sequences: newSequences });
    }

    clearAllSteps = () => {
        const updatedSequences = this.state.sequences.map((sequence)=>{
            const updatedSteps = Array(this.state.numSteps).fill(false);
            return { ...sequence, steps: updatedSteps };
        });
        this.setState({ sequences: updatedSequences });
    }

    playStep = () => {
        const {currentStep, sequences, numSteps} = this.state;
        sequences.forEach((sequence) => {
            const decay = sequence.decay
            const currentVolume = (sequence.volume/100)
            if (sequence.steps[currentStep]){
                sequence.sound.play();
                sequence.sound.fade(currentVolume, 0.0, decay);
            }
        });
        this.setState({ currentStep: (currentStep + 1) % numSteps });
    };

    handleNumStepsChange = (event) => {
        const numSteps = parseInt(event.target.value);
        const sequences = [...this.state.sequences];
        sequences.forEach((sequence)=>{
           sequence.steps = new Array(numSteps).fill(false);
        });
        this.setState({numSteps, sequences, currentStep: 0});
    }

    setVolume = (sequenceIndex, newVolume) => {
        const sequences = [...this.state.sequences];
        sequences[sequenceIndex].volume = newVolume;
        sequences[sequenceIndex].sound.volume(newVolume/100);
        this.setState({ sequences });
    }

    setDecay = (sequenceIndex, newDecay) => {
        const sequences = [...this.state.sequences];
        sequences[sequenceIndex].decay = newDecay;
        this.setState({ sequences });

    }

    changeGlobalVolume = (volume) => {
        const newVolume = volume
        Howler.volume(newVolume / 100);
        this.setState({globalVolume: newVolume})
    }

    startSequencer = () => {
        const stepDuration = 60000 / this.state.bpm;
        this.setState({ playing: true});
        this.sequencerInterval = setInterval(this.playStep, stepDuration / 4);
    };

    stopSequencer = () => {
        this.setState({ playing: false, currentStep: 0});
        clearInterval(this.sequencerInterval);
    };

    handleBpmChange = (event) => {
        const newBpm = parseInt(event.target.value);
        this.setState({ bpm: newBpm});
    }


    render() {
        return (
            <main>
                {this.state.sequences.map((sequence, lineIndex)=>(
                    <div className="sequence__line" key={lineIndex}>
                        <div className='sequence__grid'>
                            <span className="sequence__grid--name" onClick={()=> this.trySound(lineIndex)}>{sequence.name}</span>
                            <div className="sequence__grid--steps">
                                {sequence.steps.map((step, stepIndex)=>(
                                    <button
                                        key={stepIndex}
                                        className={`${step ? 'active' : 'inactive'} ${stepIndex === this.state.currentStep ? 'playing' : ''}`}
                                        onClick={()=> this.toggleStep(lineIndex, stepIndex)}>{stepIndex+1}
                                    </button>                                    
                                ))}                                
                            </div>
                        </div>
                        <div className="sequence__underline">
                            <div className="sequence__parameter sequence__parameter--volume">
                                <label htmlFor={"volumeRange--"+(lineIndex+1)}>Volume: {this.state.sequences[lineIndex].volume}</label>
                                <input
                                    type="range"
                                    id={"volumeRange--"+(lineIndex+1)}
                                    min="0"
                                    max="100"
                                    step="1"
                                    value={this.state.sequences[lineIndex].volume}
                                    onChange={(e) => this.setVolume(lineIndex, parseInt(e.target.value))}
                                />                              
                            </div>

                        </div>

                    </div>
                ))}
                <div className="globalParameters">
                    <div className="globalParameters__ranges">
                        <div className="globalParameters__tempo">
                            <label htmlFor="bpmRange">Tempo (BPM): {this.state.bpm}</label>
                            <input
                                type="range"
                                id="bpmRange"
                                min="60"
                                max="200"
                                value={this.state.bpm}
                                onChange={this.handleBpmChange}
                            />                    
                        </div>
                        <div className="globalParameters__steps">
                            <label htmlFor="stepsRange">Nombre de pas:</label>
                            <select
                                id="stepsRange"
                                value={this.state.numSteps}
                                onChange={this.handleNumStepsChange}                              
                            >
                                <option value="4">4</option>
                                <option value="8">8</option>
                                <option value="16">16</option>
                                <option value="32">32</option>
                            </select>
                        </div>
                        <div className="globalParameters__volume">
                            <label htmlFor="globalVolumeRange">Volume: {this.state.globalVolume}</label>
                            <input
                                type="range"
                                id="globalVolumeRange"
                                min="0"
                                max="100"
                                step="1"
                                value={this.state.globalVolume}
                                onChange={(e) => this.changeGlobalVolume(parseInt(e.target.value))}
                            />                     
                        </div>
                    </div>
                    <div className="globalParameters__buttons">
                        <div className="globalParameters__lecture">
                            <button className={`parameter__lecture--play ${this.state.playing ? 'running' : 'stopped'}`} onClick={this.state.playing ? this.stopSequencer : this.startSequencer}>
                                {this.state.playing? 'Stop' : 'Play'}
                            </button>
                            <button className="parameter__lecture--clear" onClick={this.clearAllSteps}>Clear</button>                    
                        </div> 
                    </div>                    
                </div>

              

            </main>
        );
    }
}

export default StepSequencer;