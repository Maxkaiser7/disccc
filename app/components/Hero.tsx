export default function Hero() {
    return (
        <div className="pb-80">
            <div className="absolute flex items-start justify-center flex-col m-8">
                <span id={"headings"} className={"text-3xl flex flex-wrap"}>
                    <h2>Découvrez.</h2>
                    <h2>Partagez.</h2>
                    <h2>Collaborez.</h2>
                </span>
                <p>Disccc vous permet de découvrir des artistes et
                    des salles de concerts près de chez vous pour collaborer et vous
                    produire sur scène.</p>
            </div>
            <img
                src="../images/assets/gradient.png"
                alt=""
                className="left-0 absolute -z-10 h-1/4 w-screen min-h-[18rem]"
            />
        </div>
    );

}