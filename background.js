chrome.history.onVisited.addListener(async (res) => {
  console.log("---", res, res.title);

  //
  //   chrome.bookmarks.getTree((tree) => {
  //     console.log("tree", tree);
  //   });

  await chrome.bookmarks.getChildren("1", (bk) => {
    let folderId = false;

    bk.forEach((element) => {
      console.log(element.title, element.title === "My Shows Manager");
      if (element.title === "My Shows Manager") {
        folderId = element.id;
      }
    });
    // console.log("bk", bk);

    console.log("fired", folderId);

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
