import {log} from "util";
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai";

export default function LikeButton(props){
    return(
        <button onClick={props.clickEvent}>
            {props.isLiked ? <AiFillHeart style={{"width": "40px", "height": "40px"}}/> :
                <AiOutlineHeart style={{"width": "40px", "height": "40px"}}/>}
        </button>
    )
}