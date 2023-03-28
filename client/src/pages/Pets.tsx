import {UseGenerateName} from "../api/useApi";
export default function Pets(){
    const {name,setName,loading,data,fetch}=UseGenerateName();
    const handleSubmit = (event:React.SyntheticEvent) => {
        event.preventDefault();
        fetch();
    };
    return (
        <div style={{textAlign:"center"}}>
            <h3 >Apodos para mascotas</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    placeholder="Ingresa un animal"
                    onChange={(event) => setName(event.target.value)}
                />
                <input type="submit" value="Enviar" />
            </form>
            {loading && <div>Cargando...</div>}
            {data && <div><p>{data.result} </p></div>}
        </div>
    )
}