import React from "react";
import Typography from '@material-ui/core/Typography';
import Navigation from '../../components/Navigation/Navigation.jsx';
import Invitation from '../../components/Invitation/Invitation.jsx';
import Grid from "@material-ui/core/Grid";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class Dashboard extends React.Component {

  state = {}

  constructor(props) {
    super(props);
    this.state = {
      invitations: props.data
        ? props.data
        : [],
      users: props.users
        ? props.users
        : [],
      openDialog: false,
      req_detail: "Simple invitation",
      req_date: new Date().toString(),
      req_username: "",
      searchedVal:""
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.invitations !== nextProps.invitations) {
      this.setState({invitations: nextProps.data});
    }
  }

  /* CALLBACK RELAYERS */
  ClickHandler(type, id) {
    this.props.InvitationCallback(type, id);
  }
  CreateNew() {
    console.log("Want to create ", this.state.req_detail, this.state.req_date, this.state.req_username);
    let reqId = 0;
    this.state.users.forEach((e) => {
      if (e.name === this.state.req_username) {
        reqId = e.id
      }
    })
    this.props.createRequest(reqId, this.state.req_detail, this.state.req_date);
  }
  SearchCallback(value){
    this.setState( {searchedVal: value} );
  }
  /* DIALOG HANDLERS */
  handleClickOpen() {
    this.setState({openDialog: true});
  }
  handleClose() {
    this.setState({openDialog: false});
  }

  render() {
    let self = this;
    let InvitationListAll = this.state.invitations.requested_invitations
    let WaitingListAll = this.state.invitations.owned_invitations

    // If case of any search value, search it
    if(this.state.searchedVal && this.state.searchedVal.trim() !== "" ) {
       InvitationListAll = (this.state.invitations.requested_invitations).filter(elem => {
         let desc = elem.desciption.toLowerCase();
         if(!this.state.searchedVal || !desc) return false;
         return desc.includes( (this.state.searchedVal).toLowerCase() ) });
       WaitingListAll = (this.state.invitations.owned_invitations).filter(elem => {
         let desc = elem.desciption.toLowerCase();
         if(!this.state.searchedVal || !desc) return false;
         return desc.includes( (this.state.searchedVal).toLowerCase() ) });
    }
    const InvitationList = InvitationListAll.map((data,i) => <Invitation key={i} data={data} users={self.state.users} delegator={this.ClickHandler.bind(this)} owner="false"></Invitation>);
    const WaitingList = WaitingListAll.map((data,i) => <Invitation key={i} data={data} users={self.state.users} delegator={this.ClickHandler.bind(this)} owner="true"></Invitation>);
    const userMapper = this.state.users.map((user,i) => <MenuItem key={i} value={user.name}>{user.name}</MenuItem>);

    return (<Grid>
      <Navigation clickHandler={this.handleClickOpen.bind(this)} LogoutCallback={this.props.LogoutCallback.bind(this)} SearchCallback={this.SearchCallback.bind(this) } ></Navigation>
      <Dialog open={this.state.openDialog} onClose={this.handleClose.bind(this)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create New Invitation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create a new invitation for your friends to join.
          </DialogContentText>
          <Select value={this.state.req_username} onChange={(event) => {
              this.setState({req_username: event.target.value})
            }}>
            {userMapper}
          </Select>
          <TextField margin="dense" label="About" onChange={(event) => {
              this.setState({req_detail: event.target.value})
            }} fullWidth/>
          <TextField margin="dense" label="Date" type="date" defaultValue="2019-10-10" onChange={(event) => {
              this.setState({req_date: event.target.value})
            }} fullWidth/>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.CreateNew.bind(this)} color="primary">
            Create
          </Button>
          <Button onClick={this.handleClose.bind(this)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Grid style={{
          marginLeft: "5%",
          marginRight: "5%",
          marginTop: "1%"
        }}>
        <Typography variant="title" color="inherit">
          Invitations
        </Typography>
        <Grid container justify="space-evenly">
          {InvitationList}
        </Grid>
      </Grid>
      <Grid style={{
          margin: "5%"
        }}>
        <Typography variant="title" color="inherit">
          Your Requests
        </Typography>
        <Grid container justify="space-evenly">
          {WaitingList}
        </Grid>
      </Grid>
    </Grid>);
  }
}

export default Dashboard;
