const axios = require("axios");

exports.dateChanger = function(date){
    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Aôut", "Septembre", "Octobre", "Novembre", "Decembre"];
    const dateFormated = date.split("-");
    const years = dateFormated[0];
    const month = dateFormated[1];
    const days = dateFormated[2].split(" ")[0];
    const d = new Date();
    return `Le ${days} ${monthNames[month - 1]}, ${years}`;
},
exports.getToken = async function(id){
  const token = (await axios.get(`http://localhost:4242/getToken?userId=${id}`)).data.token
  return token;
}