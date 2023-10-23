import { Component } from "react";
import kick from "../../assets/samples/kick.wav";
import snare from "../../assets/samples/snare.wav";
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
                {sound : new Howl({ src: [kick], volume: 1}), steps: [], name: 'Kick', volume: 100},
                {sound : new Howl({ src: [snare], volume: 1}), steps: [], name: 'Snare', volume: 100},
                {sound : new Howl({ src: [openHat], volume: 1}), steps: [], name: 'Open Hat', volume: 100},
                {sound : new Howl({ src: [closedHat], volume: 1}), steps: [], name: 'Closed Hat', volume: 100},
                {sound : new Howl({ src: [bass], volume: 1}), steps: [], name: 'Bass', volume: 100}
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
    
    toggleStep = (lineIndex, stepIndex) => {
        const newSequences = [...this.state.sequences];
        newSequences[lineIndex].steps[stepIndex] = !newSequences[lineIndex].steps[stepIndex];
        this.setState({ sequences: newSequences });
    }

    clearAllSteps = () =>{
        this.state.sequences.forEach((sequence)=>{
            sequence.steps = new Array(this.state.numSteps).fill(false);
        });
    }

    playStep = () => {
        const {currentStep, sequences, numSteps} = this.state;
        sequences.forEach((sequence) => {
            if (sequence.steps[currentStep]){
            sequence.sound.play();
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
                            <span className="sequence__grid--name">{sequence.name}</span>
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
                        <div className="sequence__volume">
                            <label htmlFor="volumeRange">Volume: {this.state.sequences[lineIndex].volume}</label>
                            <input
                                type="range"
                                id="volumeRange"
                                min="0"
                                max="100"
                                step="1"
                                value={this.state.sequences[lineIndex].volume}
                                onChange={(e) => this.setVolume(lineIndex, parseInt(e.target.value))}
                            />                              
                        </div>
                    </div>
                ))}
                <div className="parameter__tempo">
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
                <div className="parameter__steps">
                    <label htmlFor="stepsRange">Nombre de pas: {this.state.numSteps}</label>
                    <input
                        type="range"
                        min="1"
                        max="16"
                        value={this.state.numSteps}
                        onChange={this.handleNumStepsChange}
                    />
                </div>
                <div className="parameter__volume">
                    <label htmlFor="globalVolumeRange">Volume: {this.state.globalVolume}</label>
                    <input
                        type="range"
                        id="volumeRange"
                        min="0"
                        max="100"
                        step="1"
                        value={this.state.globalVolume}
                        onChange={(e) => this.changeGlobalVolume(parseInt(e.target.value))}
                    />                     
                </div>
                <div className="parameter__lecture">
                    <button className="parameter__lecture--play" onClick={this.state.playing ? this.stopSequencer : this.startSequencer}>
                        {this.state.playing? 'Stop' : 'Play'}
                    </button>
                    <button className="parameter__lecture--clear" onClick={this.clearAllSteps}>Clear</button>                    
                </div>               

            </main>
        );
    }
}

export default StepSequencer;