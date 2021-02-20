import React, { useState } from "react";
import {
  makeStyles,
  ListItem,
  MenuItem,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
} from "@material-ui/core/";
import { Link } from "react-router-dom";

const useStyle = makeStyles((theme) => ({
  listItem: {
    fontSize: "1rem",
    color: "#005598",
    textDecoration: "none",
  },
  ListItemRoot: {
    width: "auto",
    padding: "0 0.8rem",
  },
}));

const MenuItems = (props) => {
  const classes = useStyle(props);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ListItem disableGutters classes={{ root: classes.ListItemRoot }}>
      <Link
        className={classes.listItem}
        aria-controls={`sub-menu-id-${props.id}`}
        style={{ display: "flex", alignItems: "center" }}
        onClick={handleClick}
        to={props.url}
        style={{
          display: props.display ? props.display : "block",
        }}
      >
        {props.name}
      </Link>
      <Popper
        id={`sub-menu-id-${props.id}`}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transition
        disablePortal
        style={{ zIndex: 99 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id={`sub-menu-id-${props.id}`}>
                  {props.hasSubmenu
                    ? props.subMenuItems.map((subItems, subIndex) => {
                        return (
                          <MenuItem
                            onClick={handleClose}
                            key={subIndex}
                            onClick={() => {
                              setAnchorEl(null);
                              props.history.push(subItems.url);
                            }}
                            style={{
                              display: subItems.display
                                ? subItems.display
                                : "block",
                            }}
                          >
                            {subItems.name}
                          </MenuItem>
                        );
                      })
                    : null}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </ListItem>
  );
};

export default MenuItems;
