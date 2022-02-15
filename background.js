chrome.history.onVisited.addListener(async (res) => {
  console.log("---", res, res.title);

  chrome.storage.sync.get(["shows"], function (result) {
    // console.log("Value currently is " + result.shows);
    let arr = JSON.parse(result.shows);

    arr.forEach((element) => {
      if (
        res.title.includes(element.title) &&
        res.title.toLowerCase().includes("episode") &&
        !res.title.toLowerCase().includes("youtube")
      ) {
        console.log("yay");
        return;
      }
    });
  });

  return;

  await chrome.bookmarks.getChildren("1", (bk) => {
    let folderId = false;

    bk.forEach((element) => {
      console.log(element.title, element.title === "My Shows Manager");
      if (element.title === "My Shows Manager") {
        folderId = element.id;
      }
    });

    console.log("folderId", folderId);

    if (!folderId) {
      chrome.bookmarks.create(
        {
          parentId: "1",
          title: "My Shows Manager",
        },
        (folder) => {
          chrome.bookmarks.create({
            parentId: folder.id,
            url: res.url,
            title: res.title,
          });
        }
      );
    } else {
      console.log("fired");
      chrome.bookmarks.create({
        parentId: folderId,
        url: res.url,
        title: res.title,
      });
    }
  });
});
