chrome.history.onVisited.addListener(async (res) => {
  console.log("history.onVisited", { history: res });

  chrome.storage.sync.get(["shows"], function (result) {
    console.log("storage.sync.get", { storedShows: result });
    let shows = JSON.parse(result.shows);

    console.log("storedShows.forEach:::");
    shows.forEach((show) => {
      let url = res.url.replace(/-/g, " ");
      console.log("show iteration:", {
        cleanUrl: url,
        show,
        isUrlIncludesShowTitle: url.includes(show.title.toLowerCase()),
      });
      if (
        (res.title.toLowerCase().includes(show.title.toLowerCase()) ||
          url.toLowerCase().includes(show.title.toLowerCase())) &&
        (res.title.toLowerCase().includes("episode") ||
          url.toLowerCase().includes("episode")) &&
        !res.title.toLowerCase().includes("youtube")
      ) {
        console.log("found match for following show: ", { show });
        let epIndex = res.title.toLowerCase().indexOf("episode");

        if (epIndex === -1) {
          epIndex = url.toLowerCase().indexOf("episode");
        }

        let epNo = res.title.slice(epIndex, epIndex + 10).trim();
        console.log(show.title, " Ep No", epNo);

        chrome.bookmarks.getChildren("1", (bk) => {
          let folderId = false;

          bk.forEach((element) => {
            if (element.title === "My Shows Manager") {
              folderId = element.id;
            }
          });

          console.log("folder id:", { folderId });

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
            chrome.bookmarks.getChildren(folderId, (showsBk) => {
              showsBk.forEach((b) => {
                let searchWord = b.title.slice(0, -10).trim();
                if (
                  show.title.toLowerCase().includes(searchWord.toLowerCase())
                ) {
                  chrome.bookmarks.remove(b.id);
                }
              });
            });
            chrome.bookmarks.create({
              parentId: folderId,
              url: res.url,
              title: show.title + " " + epNo,
            });
          }
        });
      }
    });
    console.log("storedShows.forEach END:::");
  });
});
