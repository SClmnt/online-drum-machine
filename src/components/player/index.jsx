import { Howl} from 'howler';
import kick from "../../assets/samples/kick.wav";

export default function Player(){
    function lecture(){
            var sound = new Howl({
        src: [kick],
        volume: 0.1
        })
        sound.play()
    }

    console.log() 
     return(
         <button onClick={lecture}>Howler</button>
     )
 }