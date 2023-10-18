import useSound from 'use-sound';

import kick from "../../assets/samples/kick.wav"


export default function Sampler(props){
   const [playSound] = useSound(kick, { volume: 0.1 });
   console.log() 
    return(
        <button onClick={playSound}>{props.name}</button>
    )
}

