import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';

const styles = {
  title: { color: "white" },
  searchBar: { background: "rgba(250,250,250,0.5)"},
  button: {
    height: "60%",
    background: "linear-gradient(to bottom, #ece9e6, #ffffff)",
    color: '#192138',
    marginRight:"42px"
  },
  search: {
    color: "white !important",
    marginTop: "5px",
    marginLeft: "3px",
    marginRight: "1px"
  }
}

class Dashboard extends React.Component {
  state = { }

  constructor(props){
    super(props);
    this.state = {
      title: props.title? props.title: "JAM",
      searchvalue: ""
    }
  }

  handleRequest(){
    this.props.clickHandler();
  }

  handleQuit(){
    this.props.LogoutCallback();
  }

  SearchHandler(e){
    this.setState( { searchvalue: e.target.value });
    this.props.SearchCallback(e.target.value);
  }
  render() {
    return (
      <div>
         <AppBar position="static" style={{backgroundColor:"black !important", background: "linear-gradient(45deg, #5b2e7e 30%, #220f34 90%)"}}>
             <Toolbar>
                 <Typography variant="title" color="inherit">
                 Dashboard
                 </Typography>
                 <Grid
                    container
                    direction="row"
                    justify="flex-end"
                    alignItems="center"
                  >
                  <div style={{display:"inline-flex", marginRight: "3%", height:  "35px", background:"rgba(210,210,210,0.2)", borderRadius: "5px"}}>
                      <div>
                        <SearchIcon style={styles.search} />
                      </div>
                      <InputBase
                        className="SearchInput"
                        placeholder="Search…"
                        value={ this.state.searchvalue }
                        onChange={ this.SearchHandler.bind(this) }
                      />
                    </div>
                 </Grid>
                 <Grid
                    container
                    direction="row"
                    justify="flex-end"
                    alignItems="center"
                  >
                     <Button variant="contained" color="primary" style={styles.button} onClick={this.handleRequest.bind(this)}>
                       New Invitation
                     </Button>
                     <Fab className="declineButton" onClick={this.handleQuit.bind(this)} style={{marginLeft: "10px"}}>
                       <Icon color="inherit">power_settings_new</Icon>
                     </Fab>
                 </Grid>
             </Toolbar>
         </AppBar>
       </div>
    );
  }
}

export default Dashboard;
