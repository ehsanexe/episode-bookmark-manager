import { Chip, IconButton, Input, Tooltip } from "@mui/material";
import "./App.css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { green, orange } from "@mui/material/colors";
import { Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [shows, setShows] = useState([]);
  const [showName, setShowName] = useState("");

  const getShows = () => {
    console.log("getShow: called");
    chrome.storage.sync.get(["shows"], (result) => {
      let storedShows = JSON.parse(result.shows);
      setShows(storedShows);
      console.log("getShow: value => ", storedShows);
    });
  };

  useEffect(() => {
    getShows();
  }, []);

  const handleAddShow = () => {
    console.log("add: called");
    chrome.storage.sync.set({
      shows: JSON.stringify([...shows, { id: uuidv4(), title: showName }]),
    });
    setShowName("");
    getShows();
  };

  const handleDeleteShow = (id) => {
    console.log("delete: called");
    const splicedShows = [...shows];
    const index = shows.findIndex((s) => s.id === id);
    splicedShows.splice(index, 1);
    chrome.storage.sync.set({ shows: JSON.stringify(splicedShows) });
    console.log("delete: value => ", splicedShows);
    getShows();
  };

  return (
    <div className="ep-bookmark-mgr">
      <div className="header">
        <div>
          <span className="title">Episode Bookmark Manager</span>
        </div>
        <Tooltip
          title={`Enter the name of show as written on the site and click on add button thats it. Bookmarks of your favourite shows will be maintained in "My Shows Manager" folder in bookmark bar. If extension doesn't work try different combination of words`}
        >
          <HelpOutlineIcon sx={{ color: orange[500] }} />
        </Tooltip>
      </div>
      <div className="add-show">
        <Input
          value={showName}
          onChange={(e) => setShowName(e.target.value)}
          sx={{ marginRight: "1rem" }}
          placeholder="Show Name"
          fullWidth
        />
        <IconButton
          onClick={handleAddShow}
          sx={{ padding: 0 }}
          aria-label="addCircleOutlineIcon"
        >
          <AddCircleOutlineIcon sx={{ color: green["A200"] }} />
        </IconButton>
      </div>

      <div className="shows">
        {shows.map((show) => {
          return (
            <Chip
              key={show.id}
              label={show.title}
              onDelete={() => handleDeleteShow(show.id)}
              deleteIcon={<Delete />}
              variant="outlined"
              sx={{ justifyContent: "space-between", padding: "0 1rem" }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
