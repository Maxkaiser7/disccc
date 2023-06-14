type Props = {
    isDisabled: boolean;
    inputValue: string;
};
export default function SubmitButton(props:Props){
    return(
        <input type={"submit"} className={`bg-slate-800 hover:bg-slate-600 text-white py-2 px-4 mt-2 text-center ${props.isDisabled ? "disabled:opacity-20" : ""}`} value={props.inputValue} disabled={props.isDisabled}/>
    )
}