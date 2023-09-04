chrome.history.onVisited.addListener(async (onVisitedHistory) => {
  console.log("history.onVisited", { history: onVisitedHistory });

  await chrome.storage.sync.get(["isPaused"], function (storedPausedState) {
    let isPaused = false;

    console.log("storedPausedState:", storedPausedState);
    isPaused = JSON.parse(storedPausedState?.isPaused || "false");
    console.log("isPaused:", isPaused);

    if (!isPaused) {
      chrome.storage.sync.get(["shows"], function (storedShows) {
        console.log("storage.sync.get", { storedShows: storedShows });
        let shows = JSON.parse(storedShows.shows);

        console.log("storedShows.forEach:::");
        shows.forEach((show) => {
          let url = onVisitedHistory.url.replace(/-/g, " ");
          console.log("show iteration:", {
            cleanUrl: url,
            show,
            isUrlIncludesShowTitle: url.includes(show.title.toLowerCase()),
          });
          if (
            (onVisitedHistory.title
              .toLowerCase()
              .includes(show.title.toLowerCase()) ||
              url.toLowerCase().includes(show.title.toLowerCase())) &&
            (onVisitedHistory.title.toLowerCase().includes("episode") ||
              url.toLowerCase().includes("episode")) &&
            !onVisitedHistory.title.toLowerCase().includes("youtube")
          ) {
            console.log("found match for following show: ", { show });
            let epIndex = onVisitedHistory.title
              .toLowerCase()
              .indexOf("episode");

            if (epIndex === -1) {
              epIndex = url.toLowerCase().indexOf("episode");
            }

            let epNo = onVisitedHistory.title
              .slice(epIndex, epIndex + 10)
              .trim();
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
                      url: onVisitedHistory.url,
                      title: show.title + " " + epNo,
                    });
                  }
                );
              } else {
                chrome.bookmarks.getChildren(folderId, (showsBk) => {
                  showsBk.forEach((b) => {
                    let searchWord = b.title.slice(0, -10).trim();
                    if (
                      show.title
                        .toLowerCase()
                        .includes(searchWord.toLowerCase())
                    ) {
                      chrome.bookmarks.remove(b.id);
                    }
                  });
                });
                chrome.bookmarks.create({
                  parentId: folderId,
                  url: onVisitedHistory.url,
                  title: show.title + " " + epNo,
                });
              }
            });
          }
        });
        console.log("storedShows.forEach END:::");
      });
    }
  });
});
