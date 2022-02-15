let ids = [];

chrome.storage.sync.get(["shows"], function (result) {
  console.log("Value currently is " + result.shows);
  let arr = JSON.parse(result.shows);

  arr.forEach((element) => {
    console.log(element);
    ids.push(element.id);
    const div = document.createElement(`div`);
    div.innerHTML = `<input id="i${element.id}" placeholder='Enter show name' value="${element.title}" />`;
    document.getElementById("shows").appendChild(div);
  });
});

document.getElementById("add").onclick = function handleAdd(e) {
  let id = Math.floor(Math.random() * 1000000);
  ids.push(id);

  const div = document.createElement(`div`);
  div.innerHTML = `<input id="i${id}" placeholder='Enter show name' />`;
  document.getElementById("shows").appendChild(div);
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
