"use client"
import {log} from "util";
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai";
import {useState} from "react";
import axios from "axios";
export default function LikeButton(props : any){
    const [fillLike, setFillLike] = useState(props.isLiked);
    const artistId = props.artistId
    const userId = props.userId
    const handleClick = async () => {
        setFillLike(!fillLike);
        const result = await axios.post("/api/artists/addLike", {
            params: {artistId, userId},
        });
    }
    return(
        <button onClick={handleClick}>
            {fillLike ? <AiFillHeart style={{"width": "40px", "height": "40px"}}/> :
                <AiOutlineHeart style={{"width": "40px", "height": "40px"}}/>}
        </button>
    )
}