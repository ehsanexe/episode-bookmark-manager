let ids = [];

document.getElementById("add").onclick = function handleAdd(e) {
  let id = Math.floor(Math.random() * 1000000);
  ids.push(id);

  const div = document.createElement(`div`);
  div.innerHTML = `<input id="i${id}" placeholder='Enter show name' />`;
  document.getElementById("shows").appendChild(div);
};

// function handleSave() {
//   console.log("z");
// }

document.getElementById("save").onclick = function handleSave(e) {
  //   let x = document.getElementById("50").value;
  let shows = [];
  for (let i = 0; i < ids.length; i++) {
    shows.push(document.getElementById(`i${ids[i]}`).value);
  }
  console.log("shows", shows);
};
