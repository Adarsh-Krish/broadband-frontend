import React from "react";
import { Drawer, List, ListItem, ListItemText, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";

const drawerWidth = 240;

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
        },
      }}
    >
      <Toolbar>
        <h3>Broadband Portal</h3>
      </Toolbar>

      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem button component={Link} to="/customers">
          <ListItemText primary="Customers" />
        </ListItem>

        <ListItem button component={Link} to="/add-customer">
          <ListItemText primary="Add Customer" />
        </ListItem>

        <ListItem button component={Link} to="/commissions">
          <ListItemText primary="Commissions" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
