const { default: axios } = require("axios");
console.log("hola mundo");
var data = {
  price: 100,
  id: "hdhdsdhshd1",
  deliveryDate: "20/03/2021",
  clientId: "ac.lopez",
  printerId: 8372,
  manufacturerId: "rer2323342",
  catalogItemId: "sjdfhgfhrefrf",
  printSettingsIds: "hdahdjsahdsjde",
  signature: "cVbdRomnb0GQIjVI7itA6A+Xam7Y7oPewCMgejLJMl0GfOW7PHH6cl57F1zNbdHPz1GT2qnKaV5f5QJj39R6uylfNOwWGk4yv332b8PBGwRbHauqtLXV5WayxjTHEtCUmSrtvUVcsVrLGlgXyjOCuTJ800xzGRrVwzRcx/Ugo56d4Gx7omA6zHcHigY/GCSVImRwxBoOeFUiEywUVIctCkZGvUGemmlex0+/cRQg/WG6sGQJub+CNJCO5iLFPhvn0R5RAal++Qbs0fpj2Ki3eAf9gvhh0KROFCDN5k8rNPsLK6XoJ9Mg7egZvBkn9mvZmljmL3ycocv0MIEDZ/GEKw=="
}
async function f() {
  let post = await axios.post(`http://localhost:3001/api/quote/`, data);
  console.log(post.data)
  setTimeout(f2(),1000);
}
async function f2() {
  const txid1 = "hdhdsdhshd1";
  post = await axios.get(`http://localhost:3001/api/quote/${txid1}`);
  console.log(post.data);
  post = await axios.get(`http://localhost:3003/api/order/${txid1}`);
  console.log(post.data);
  post = await axios.get(`http://localhost:3002/api/print/${txid1}`);
  console.log(post.data);
  post = await axios.get(`http://localhost:3004/api/deliver/${txid1}`);
  console.log(post.data);
  post = await axios.get(`http://localhost:3004/api/printFinish/${txid1}`);
  console.log(post.data);
  post = await axios.get(`http://localhost:3005/api/return/${txid1}`);
  console.log(post.data);
  console.log("--------------------------------------");
  console.log("The modules have been started correctly");
  console.log("--------------------------------------");
}
f();