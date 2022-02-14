let x = false;

document.getElementById("add").onclick = function handleAdd(e) {
  // Math.random()
  const div = document.createElement(`div`);
  div.innerHTML = `<input id="50" placeholder='Enter show name' /> <button id="btn" >Save</button> `;
  document.getElementById("shows").appendChild(div);
  x = true;
};

// function handleSave() {
//   console.log("z");
// }

if (x) {
  document.getElementById("btn").onclick = function handleSave(e) {
    //   let x = document.getElementById("50").value;
    console.log("sss");
  };
}
