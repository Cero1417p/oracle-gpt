import { useEffect, useState } from "react";
import { formarttedDate } from "./const";
import { GenerateName, IResponse } from "./generate";

export const UseGenerateName = () => {
    const [name, setName] = useState("");
    const [data, setData] = useState<IResponse>({ message: "", status: 0 });
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setName(name)
    }, [name])
    const fetch = () => {
        setLoading(true);
        GenerateName(name)
            .then((json) => {
                setData(json)
                console.log("hook : ", json)
                console.log("data : ", data)
                setLoading(false)
            });

    }
    return { name, setName, data, loading, fetch };
}
interface IData{
    result:string
}
export const UseGeneratePrediction = () => {
    const [name, setName] = useState("");
    const [date, setDate] = useState(formarttedDate);

    const [data, setData] = useState<IData>();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setName(name)
    }, [name])
    useEffect(() => {
        setDate(date)
    }, [date])

    const handleSubmit = () => {
        setLoading(true);
        fetch("https://service-oracle.onrender.com/oracle",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, date })
            })
            .then(response => response.json())
            .then((json) => {
                setData(json)
                console.log("hook : ", json)
                console.log("data : ", data)
                setLoading(false)
            });

    }
    return { name, setName, date, setDate, data, loading, handleSubmit };
}
