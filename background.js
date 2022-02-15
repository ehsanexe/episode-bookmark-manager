chrome.history.onVisited.addListener(async (res) => {
  console.log("---", res, res.title);

  chrome.storage.sync.get(["shows"], function (result) {
    // console.log("Value currently is " + result.shows);
    let shows = JSON.parse(result.shows);

    shows.forEach((show) => {
      if (
        res.title.includes(show.title) &&
        res.title.toLowerCase().includes("episode") &&
        !res.title.toLowerCase().includes("youtube")
      ) {
        console.log("match");
        let epIndex = res.title.toLowerCase().indexOf("episode");
        let epNo = res.title.slice(epIndex, epIndex + 10).trim();
        console.log("ep no", epNo, res.title.toLowerCase().indexOf("episode"));

        chrome.bookmarks.getChildren("1", (bk) => {
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
                  title: show.title + " " + epNo,
                });
              }
            );
          } else {
            console.log("fired");
            chrome.bookmarks.create({
              parentId: folderId,
              url: res.url,
              title: show.title + " " + epNo,
            });
          }
        });
      }
    });
  });
});
