import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Login from "pages/Login/Login.jsx";
import Dashboard from "pages/Dashboard/Dashboard.jsx";
import mainStyle from "assets/jss/material-main-react/views/mainStyle.jsx";
import Cookies from 'universal-cookie';

const API = "http://localhost:8000/";
const cookieManager = new Cookies();

class Main extends React.Component {
  state = {
    didLoad: false,
    isLoggedIn: false,
    userId: null,
    users: [],
    invitations: {},
    searchParam: "",
    loginRelated: {
      haveError: false,
      errorMessage: ""
    },
    generalError: {
      on: false,
      message: "Internal server error!"
    }
  };

  componentDidMount() {
    // Check if he has cookie..
    let cuid = cookieManager.get("uid");
    if (cuid) {
      this.setState({isLoggedIn: true, userId: cuid});
      this.loadUserInvitations(cuid);
    } else {
      this.setState({isLoggedIn: false, userId: 0});
    }
  }

  // CALLBACKS
  LoginCallback(type, data) {
    let self = this;
    fetch(API + type, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"username": data})
    }).then(response => {
      const statusCode = response.status;
      const data = response.json();
      return Promise.all([statusCode, data]);
    }).then((data) => {
      let resCode = data[0];
      if (resCode === '404') {
        self.setState({
          loginRelated: {
            haveError: true,
            errorMessage: data[1].message
          }
        })
      } else if (resCode === 200) {
        console.log("Setting uid ", data[1].id);
        cookieManager.set('uid', data[1].id, {path: '/'});
        self.setState({isLoggedIn: true, userId: data[1].id});
        self.loadUserInvitations(data[1].id);
      } else {
        self.setState({
          loginRelated: {
            haveError: true,
            errorMessage: data[1].message
          }
        })
      }
    }).catch(function(error) {
      console.log(error.json().message);
      self.setState({
        loginRelated: {
          haveError: true,
          errorMessage: error.message
        }
      })
    });
  }
  LogoutCallback(){
    cookieManager.remove("uid");
    window.location.reload()
  }
  UpdateInvitationCallback(type, id) {
    let self = this;
    fetch(API + "invitation/update", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"iid": id, "uid": self.state.userId, "op": type})
    }).then(response => {
      const statusCode = response.status;
      const data = response.json();
      return Promise.all([statusCode, data]);
    }).then((data) => {
      let resCode = data[0];
      if (resCode === '404') {
        console.error(data[1].message);
      } else if (resCode === 200) {
        window.location.reload()
      } else {
        self.setState({
          generalError: {
            on: true,
            errorMessage: "Internal error"
          }
        })
      }
    }).catch(function(error) {
      console.log(error.json().message);
      self.setState({
        generalError: {
          on: true,
          errorMessage: error
        }
      })
    });
  }
  CreateCallback(id, about, date) {
    let self = this;
    fetch(API + "invitation/create", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"to": id, "from": self.state.userId, "when": date, "about": about})
    }).then(response => {
      const statusCode = response.status;
      const data = response.json();
      return Promise.all([statusCode, data]);
    }).then((data) => {
      let resCode = data[0];
      if (resCode === '404') {
        console.error(data[1].message);
      } else if (resCode === 200) {
        window.location.reload()
      } else {
        self.setState({
          generalError: {
            on: true,
            errorMessage: "Internal error"
          }
        })
      }
    }).catch(function(error) {
      console.log(error.json().message);
      self.setState({
        generalError: {
          on: true,
          errorMessage: error
        }
      })
    });
  }

  // Helper functions
  loadUserInvitations(userId) {
    let self = this;
    fetch(API + "invitation/" + userId).then(response => {
      const statusCode = response.status;
      const data = response.json();
      return Promise.all([statusCode, data]);
    }).then((data) => {
      let resCode = data[0];
      if (resCode === 200) {
        self.setState({invitations: data[1]});
        self.loadUsers();
      } else {
        self.setState({
          generalError: {
            on: true,
            errorMessage: data[1].message
          }
        })
      }
    }).catch(function(error) {
      self.setState({
        generalError: {
          on: true,
          errorMessage: error
        }
      })
    });
  }
  loadUsers() {
    let self = this;
    fetch(API + "users/").then(response => {
      const statusCode = response.status;
      const data = response.json();
      return Promise.all([statusCode, data]);
    }).then((data) => {
      let resCode = data[0];
      if (resCode === 200) {
        let userData = data[1].users;
        let others = [];
        userData.forEach((user) => {
          if ((user.id + "") !== (self.state.userId + "")) {
            others.push(user);
          }
        })
        self.setState({users: others, didLoad: true});
      } else {
        self.setState({
          generalError: {
            on: true,
            errorMessage: data[1].message
          }
        })
      }
    }).catch(function(error) {
      self.setState({
        generalError: {
          on: true,
          errorMessage: error
        }
      })
    });
  }

  render() {
    // If not logged in, show Login screen
    if (!this.state.isLoggedIn) {
      return (<Login callback={this.LoginCallback.bind(this)} haveError={this.state.loginRelated.haveError} errorMessage={this.state.loginRelated.errorMessage}></Login>);
    }
    // If still loading data, show loading screen
    if (!this.state.didLoad) {
      return (<div>
        <Grid container direction="row" justify="center" alignItems="stretch" style={{
            display: "grid",
            marginTop: "20%"
          }}>
          <Typography variant="h3" gutterBottom>
            Loading..
          </Typography>
          <br/>
          <Typography gutterBottom>
            Underpaid, illegal immigrant microservices are working hard to fetch your data...
          </Typography>
        </Grid>
      </div>);
    }
    // If everything is fine, show dashboard
    return (<Dashboard data={this.state.invitations} users={this.state.users} InvitationCallback={this.UpdateInvitationCallback.bind(this)} createRequest={this.CreateCallback.bind(this)} LogoutCallback={this.LogoutCallback.bind(this)}></Dashboard>);
  }
}

export default withStyles(mainStyle)(Main);
