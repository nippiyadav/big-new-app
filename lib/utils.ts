export const dateformate = (date:string)=>{
    const onlyDate =  new Date(date);
   const newdate =  onlyDate.toLocaleDateString("en-in",{day:"2-digit",month:"short",year:"numeric"});
   return newdate
 }

 export const slugChangeIntoTitle = (data:string)=>{
    //  console.log(data); // debugging
    const title = data.split(/[/-]/).join(" ");
    // console.log(title); // debugging
    
    return title
 }

export const slugChangeIntoUrl = (data:string)=>{
    const match = data.match(/^\/([^/]+)\/(.+)/);
    // console.log(match); // debugging
    let secondPart= ""
    if (match) {
        // const firstPart = match[1]; // "wwe"
        // console.log(firstPart); // debugging
        secondPart = match[2]; // "news-dakota-kai-unhappy-real-life-wwe-superstar-boyfriend-s-recent-actions"
        // console.log(secondPart);
    }
    // console.log(secondPart); // debugging
    
    return secondPart
}