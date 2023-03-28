import { useEffect } from "react";
import { formarttedDate } from "../api/const";
import { UseGeneratePrediction } from "../api/useApi";
import oracleImage from './../assets/oracle_hands.jpg';


export default function Astrologer() {
    const { name, setName, date, setDate, data, loading, handleSubmit :fetch} = UseGeneratePrediction();

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        fetch();
    };


    const message = new SpeechSynthesisUtterance();
    message.voice = speechSynthesis.getVoices()[0];


    useEffect(() => {
        console.log(data);
        if (data) {
            message.text = data.result || "ERROR";
            speechSynthesis.speak(message);
        }
        return (() => {
            speechSynthesis.cancel();
        })

    }, [data])

    return (
        <div >
            <div className="container" style={{ display: "flex", justifyContent: "center" }}>
                <img style={{
                    maxWidth: "100%",
                    height: "auto"
                }} src={oracleImage} />
                <h2 className="topcenter" >Oráculo</h2>
                <h3 className="center">Que te depara el futuro</h3>
            </div>

            <form onSubmit={handleSubmit}>
                <label >Dime tu nombre</label>
                <input type="text" value={name} onChange={(e) => { setName(e.target.value) }} />
                <label >Selecciona tu fecha de nacimiento</label>
                <input type="date" name="trip-start"
                    value={date}
                    min="1900-01-01" max={formarttedDate()}
                    onChange={(e) => {
                        setDate(e.target.value)
                    }} />

                <input type="submit" value="Enviar" />
            </form>
            {loading && <div>Cargando...</div>}
            {data && <div>
                {data.result?.split("\n").map((e, i) => {
                    return (
                        <p key={i}>{e}</p>
                    )
                }
                )}  </div>}

        </div>
    )
}