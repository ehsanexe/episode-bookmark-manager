chrome.history.onVisited.addListener(async (res) => {
  console.log("res url , res title", res.url, res.title);

  chrome.storage.sync.get(["shows"], function (result) {
    // console.log("Value currently is " + result.shows);
    let shows = JSON.parse(result.shows);

    shows.forEach((show) => {
      let url = res.url.replace(/-/g, " ");
      console.log(
        "clean url",
        url,
        "show title",
        show.title,
        "url includes show title",
        url.includes(show.title.toLowerCase())
      );
      if (
        (res.title.toLowerCase().includes(show.title.toLowerCase()) ||
          url.toLowerCase().includes(show.title.toLowerCase())) &&
        (res.title.toLowerCase().includes("episode") ||
          url.toLowerCase().includes("episode")) &&
        !res.title.toLowerCase().includes("youtube")
      ) {
        console.log("match");
        let epIndex = res.title.toLowerCase().indexOf("episode");

        if (epIndex === -1) {
          epIndex = url.toLowerCase().indexOf("episode");
        }

        let epNo = res.title.slice(epIndex, epIndex + 10).trim();
        console.log("ep no", epNo);

        chrome.bookmarks.getChildren("1", (bk) => {
          let folderId = false;

          bk.forEach((element) => {
            // console.log(element.title, element.title === "My Shows Manager");
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
            // console.log("else fired");
            chrome.bookmarks.getChildren(folderId, (showsBk) => {
              // console.log("shows bk", showsBk);

              showsBk.forEach((b) => {
                let searchWord = b.title.slice(0, -10).trim();
                // console.log(
                //   "ddd",
                //   searchWord,
                //   show.title,
                //   show.title.toLowerCase().includes(searchWord.toLowerCase())
                // );
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
  });
});
