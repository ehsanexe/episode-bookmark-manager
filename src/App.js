import { Chip, IconButton, Input, Tooltip } from "@mui/material";
import "./App.css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { blue, green, orange, red } from "@mui/material/colors";
import { Delete } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";

function App() {
  const [shows, setShows] = useState([]);
  const [showName, setShowName] = useState("");
  const currentDraggingChip = useRef();
  const dragOverChip = useRef();
  const [filledChipIndex, setFilledChipIndex] = useState(-1);
  const [isPaused, setIsPaused] = useState(false);

  const getPausedState = () => {
    console.log("getPausedState: called");
    chrome.storage.sync.get(["isPaused"], (pausedState) => {
      console.log("pausedState:", pausedState);
      let storedPausedState = JSON.parse(pausedState.isPaused);
      setIsPaused(storedPausedState);
    });
  };

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
    getPausedState();
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

  const onDragEnd = () => {
    const temp = [...shows];
    temp.splice(currentDraggingChip.current, 1);
    temp.splice(dragOverChip.current, 0, shows[currentDraggingChip.current]);
    setShows([...temp]);
    setFilledChipIndex(-1);
    chrome.storage.sync.set({ shows: JSON.stringify([...temp]) });
  };

  return (
    <div className="ep-bookmark-mgr">
      <div className="header">
        <div>
          <span className="title">Ep Bookmark Manager</span>
        </div>
        <div className="headerIcons">
          <IconButton
            onClick={() => {
              chrome.storage.sync.set({ isPaused: JSON.stringify(!isPaused) });
              setIsPaused(!isPaused);
            }}
          >
            {!isPaused ? (
              <PlayCircleOutlineIcon sx={{ color: blue["300"] }} />
            ) : (
              <PauseCircleOutlineIcon sx={{ color: red[500] }} />
            )}
          </IconButton>
          <Tooltip
            title={`Enter the name of show as written on the site and click on add button thats it. Bookmarks of your favourite shows will be maintained in "My Shows Manager" folder in bookmark bar. If extension doesn't work try different combination of words`}
          >
            <HelpOutlineIcon sx={{ color: orange[500] }} />
          </Tooltip>
        </div>
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
        {shows.map((show, index) => {
          return (
            <Tooltip
              key={show.id}
              title={show.title}
              placement="top-start"
              enterDelay={1000}
            >
              <Chip
                className="showItemContainer"
                draggable
                onDragOver={(e) => e.preventDefault()}
                onDragStart={() => (currentDraggingChip.current = index)}
                onDragEnter={() => {
                  dragOverChip.current = index;
                  setFilledChipIndex(index);
                }}
                onDragEnd={onDragEnd}
                label={show.title}
                onDelete={() => handleDeleteShow(show.id)}
                deleteIcon={<Delete />}
                variant={filledChipIndex === index ? "filled" : "outlined"}
                sx={{
                  justifyContent: "space-between",
                  padding: "0 1rem",
                  width: "100%",
                }}
              />
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}

export default App;
