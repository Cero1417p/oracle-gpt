export const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
export const formarttedDate=()=>{
    let date = new Date();
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    let formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}