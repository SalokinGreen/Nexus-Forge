import React, { useState } from "react";
import styles from "../../../Styles/Settings.module.css";
import InviteManager from "./InviteManager";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
const Settings = ({ toggleModal, modalVisible }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const renderSettingsContent = () => {
    switch (selectedIndex) {
      case 0:
        return <InviteManager />;
      case 1:
        return <Typography>Setting 2 content</Typography>;
      case 2:
        return <Typography>Setting 3 content</Typography>;
      default:
        return <Typography>Unknown Setting</Typography>;
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.a} onClick={toggleModal}>
        Settings
      </p>
      {modalVisible && (
        <div className={styles.modal}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="stretch"
            width="80%"
            height="80%"
            className={styles.modalContent}
          >
            <Box width="25%">
              <Typography variant="h5">Settings</Typography>
              <Divider />
              <List component="nav">
                <ListItem
                  button
                  selected={selectedIndex === 0}
                  onClick={(event) => handleListItemClick(event, 0)}
                >
                  <ListItemText primary="Invite Manager" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedIndex === 1}
                  onClick={(event) => handleListItemClick(event, 1)}
                >
                  <ListItemText primary="Setting 2" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedIndex === 2}
                  onClick={(event) => handleListItemClick(event, 2)}
                >
                  <ListItemText primary="Setting 3" />
                </ListItem>
              </List>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box flexGrow={1} p={2}>
              {renderSettingsContent()}
            </Box>
          </Box>
          <button className={styles.closeButton} onClick={toggleModal}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Settings;
