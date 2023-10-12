// src/components/Dashboard.js

import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
  drawer: {
    width: 250,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 250,
    backgroundColor: '#ADD8E6', // Azul claro
  },
  content: {
    flexGrow: 1,
    padding: '1rem',
  },
});

function Dashboard() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{ paper: classes.drawerPaper }}
      >
        <List>
          <ListItem button>
            <ListItemText primary="Información del usuario" />
          </ListItem>
          {/* Aquí se añaden más opciones como Eventos, Pagos, Saldo, etc. */}
        </List>
      </Drawer>
      <main className={classes.content}>
        {/* Contenido principal del Dashboard */}
      </main>
    </div>
  );
}

export default Dashboard;
