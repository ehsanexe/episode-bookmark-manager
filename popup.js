let ids = [];

chrome.storage.sync.get(["shows"], function (result) {
  console.log("Value currently is " + result.shows);
  let arr = JSON.parse(result.shows);

  arr.forEach((element, index) => {
    console.log(element);
    ids.push(element.id);
    const div = document.createElement(`div`);
    div.id = `d${element.id}`;
    div.className = "inputContainer";
    div.innerHTML = `<input id="i${element.id}" placeholder='Enter show name' value="${element.title}" />  <button id="b${element.id}" >X</button> `;
    document.getElementById("shows").appendChild(div);
    document.getElementById(`b${element.id}`).onclick = function handleDel() {
      document.getElementById(`d${element.id}`).remove();
      arr.splice(index, 1);
      chrome.storage.sync.set({ shows: JSON.stringify(arr) }, function () {
        console.log("Value is set to " + shows);
      });
    };
  });
});

document.getElementById("add").onclick = function handleAdd(e) {
  let id = Math.floor(Math.random() * 1000000);
  ids.push(id);

  const div = document.createElement(`div`);
  div.id = `d${id}`;
  div.className = "inputContainer";
  div.innerHTML = `<input id="i${id}" placeholder='Enter show name' /> <button id="b${id}" >X</button> `;

  document.getElementById("shows").appendChild(div);

  document.getElementById(`b${id}`).onclick = function handleDel(params) {
    document.getElementById(`d${id}`).remove();
    chrome.storage.sync.get(["shows"], function (result) {
      let arr = JSON.parse(result.shows);
      let index = arr.findIndex((e) => e.id === id);
      arr.splice(index, 1);
      chrome.storage.sync.set({ shows: JSON.stringify(arr) }, function () {
        console.log("Value is set to " + shows);
      });
    });
  };
};

document.getElementById("save").onclick = function handleSave(e) {
  let shows = [];
  for (let i = 0; i < ids.length; i++) {
    shows.push({
      id: ids[i],
      title: document.getElementById(`i${ids[i]}`).value,
    });
  }

  console.log("shows", shows);
  chrome.storage.sync.set({ shows: JSON.stringify(shows) }, function () {
    console.log("Value is set to " + shows);
  });
};

document.on;
