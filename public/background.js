chrome.history.onVisited.addListener(async (onVisitedHistory) => {
  console.log("history.onVisited", { history: onVisitedHistory });

  await chrome.storage.sync.get(["isPaused"], function (storedPausedState) {
    let isPaused = false;

    console.group("pause");
    console.log("storedPausedState:", storedPausedState);

    isPaused = JSON.parse(storedPausedState?.isPaused || "false");

    console.log("isPaused:", isPaused);
    console.groupEnd();

    if (isPaused) {
      return;
    }

    chrome.storage.sync.get(["shows"], function (storedShows) {
      console.log("storage.sync.get", { storedShows: storedShows });
      let shows = JSON.parse(storedShows.shows);

      console.group("storedShows loop:");
      console.log("storedShows.forEach:::");
      shows.forEach((show) => {
        const url = onVisitedHistory.url;
        const cleanUrl = onVisitedHistory.url.replace(/-/g, " ");
        const title = onVisitedHistory.title;

        const isUrlIncludesShowTitle =
          title.toLowerCase().includes(show.title.toLowerCase()) ||
          cleanUrl.toLowerCase().includes(show.title.toLowerCase());

        console.log("show iteration:", {
          url,
          cleanUrl,
          title,
          show,
          isUrlIncludesShowTitle,
        });
        if (
          isUrlIncludesShowTitle &&
          !title.toLowerCase().includes("youtube")
        ) {
          console.log("found match for following show: ", { show });
          let epIndex = title.toLowerCase().indexOf("episode");

          if (epIndex === -1) {
            epIndex = cleanUrl.toLowerCase().indexOf("episode");
          }

          let epNo = title.slice(epIndex, epIndex + 10).trim();
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
                    url,
                    parentId: folder.id,
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
                url,
                parentId: folderId,
                title: show.title + " " + epNo,
              });
            }
          });
        }
      });
      console.groupEnd();
    });
  });
});
