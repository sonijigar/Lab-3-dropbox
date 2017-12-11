import { createStore } from 'redux'
import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import * as API from '../api/API';
import Divider from 'material-ui/Divider';
import Navbar from './Navbar'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FileGridList from './FileGridList';
import SharedFileList from './SharedFileList';
import Starred from './Starred';
import GroupList from './GroupList';
import Upload from 'material-ui-upload/Upload';
const style = {
    margin: 12,
    float:'right'
};

class Welcome extends Component {

    static propTypes = {
        username: PropTypes.string.isRequired,
        handleLogout: PropTypes.func.isRequired
    };

    // onBackButtonEvent = () => {
    //     e.preventDefault();
    //     if(true){
    //         window.history.go(0);
    //     }else {
    //         window.history.forward();
    //     }
    // }
    //
    // onBackButtonEvent = () => {
    //     API.doCheck()
    //         .then((status)=>{
    //             console.log(status)
    //             if(status === 201){
    //                 this.props.history.go(0);
    //             }
    //             else{
    //                 //  <Redirect to="/"/>
    //                 this.props.history.push("/login");
    //             }
    //         })
    // }

    handleFileUpload = (event) => {
        const payload = new FormData();

        payload.append('file', event.target.files[0]);
        payload.append('pathabc', this.state.dirarr)
        var objPath = {patharr:this.state.dirarr}
        API.uploadFile(payload, objPath)
            .then((status) => {
                if (status === 204) {
                     API.getFiles()
                         .then((data) => {
                             this.setState({
                                 files: data.filelist,
                                 dirs: data.dirlist
                             });
                         });
                    console.log("file sent");
                }
            });
}
    handleLoad = () => {
        API.doCheck()
            .then((status)=>{
            console.log(status)
            if(status === 201){
                this.props.history.push("/welcome");
            }
            else{
              //  <Redirect to="/"/>
                this.props.history.push("/login");
            }
            })
    }

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    createDir = () => {
        this.setState({
            open : false
        })
        var dirobj = {};
        dirobj.name = this.state.dirname
        dirobj.patharr = this.state.dirarr
        API.createDir(dirobj)
            .then((status) => {
                window.location.reload()
            if(status === 200){
                this.setState({
                    dirname : ''
                })
            }
            })
    }

    handleNavFile = () => {
        API.getFiles()
            .then((data) => {
                console.log(data);
                this.setState({
                    files: data.filelist,
                    dirs: data.dirlist,
                    disable:true
                });
            });
    }

    handleDirClick = (dirname) => {
        var arr = this.state.dirarr;
        arr.push(dirname.dirname);
        API.getFilesFromDir(dirname)
            .then((data) => {
            this.setState({
                files:data.filelist,
                dirs:data.dirlist,
                dirarr: arr,
                disable:false
            })
            });
    }

    handlesharedDirClick = (dirname) => {
        var arr = this.state.shareddirarr;
        arr.push(dirname.shareddirname);
        API.getFilesFromDir(dirname)
            .then((data) => {;
                this.setState({
                    sharedfiles:data.filelist,
                    shareddirs:data.dirlist,
                    shareddirarr: arr,
                    shareddisable:false
                })
                console.log("dirarray:", this.state.shareddirarr);
                console.log("array:",arr);
            });
    }

    handleOpen2 = (lst) => {
        console.log("lst", lst)
        this.setState({
            open2: true,

        });
    };

    handleClose2 = () => {
        this.setState({
            open2: false,
        });
    };

    handleOpen1 = (lst) => {
        console.log("lst", lst)
        this.setState({
            open1: true,
            sharename:lst
        });
    };

    handleClose1 = () => {
        this.setState({
            open1: false,
            sharename:''
        });
    };

    handleNavClick = (name) => {
        this.setState({
            category:name
        })
    }

    handleShareholderNameChange = (idx) => (evt) => {
        const newShareholders = this.state.shareholders.map((shareholder, sidx) => {
            if (idx !== sidx) return shareholder;
            return { ...shareholder, email: evt.target.value };
        });

        this.setState({ shareholders: newShareholders });
    }

    handleSubmit = (evt) => {
        const { name, shareholders } = this.state;
        alert(`Incorporated: ${name} with ${shareholders.length} shareholders`);
    }

    handleAddShareholder = () => {
        this.setState({ shareholders: this.state.shareholders.concat([{ email: '' }]) });
    }

    handleRemoveShareholder = (idx) => () => {
        this.setState({ shareholders: this.state.shareholders.filter((s, sidx) => idx !== sidx) });
    }

    handleGroupCreation = () => {
        this.setState({
            open1:false,

        })
        console.log(this.state.shareholders)
        var body = {
            holders:this.state.shareholders,
            groupname:this.state.newgroupname
        }
        console.log("bodie:",body)
        API.createGroup(body)
            .then((res)=>{
                if(res == 201){
                    console.log("object:", body)
                    console.log("email added")
                }
                else{
                    console.log("email not added")
                }
            })
    }

    createSharedDir = () => {
        this.setState({
            open2:false,

        })
        console.log(this.state.shareholders)
        var isname = this.state.newdirname;
        console.log("isname")
        var body = {
            newdirname: this.state.newdirname,
            holders:this.state.shareholders
        }
        console.log(body)
        API.createSharedGroup(body)
            .then((res)=>{
                if(res == 201){
                    console.log("email added")
                }
                else{
                    console.log("email not added")
                }
            })
    }

    constructor() {
        super();
        this.state = {
            files: [],
            dirs: [],
            groups:[],
            username : '',
            open:false,
            dirname : '',
            dirarr:[],
            disable:true,
            shareddirarr:[],
            shareddirs:'',
            sharedfiles:[],
            shareddirs:[],
            starredfiles:[],
            starreddirs:[],
            shareddisable:false,
            open1:false,
            open2:false,
            shareholders: [{email: '' }],
            sharename:'',
            newdirname:'',
            newgroupname:'',
            category:'home',
            activity:[],
        };
    }

    componentDidMount(){
        document.title = `Home-Dropbox`;
        API.getFiles()
            .then((data) => {
                console.log(data);
                this.setState({
                    files: data.filelist,
                    dirs: data.dirlist,
                    disable:true
                });
            });

        API.getSharedFiles()
            .then((data) => {
                console.log("data:",data);
                this.setState({
                    sharedfiles: data.filelist,
                    shareddirs: data.dirlist,
                    shareddisable:true
                });
                console.log("states1:", this.state.sharedfiles);
                console.log("states2:", this.state.shareddirs);

            });

        API.getGroups()
            .then((data) => {
            console.log("grouplist",data.grouplist);
            this.setState({groups:data.grouplist});
        });

        API.getStarred()
            .then(data => {
            this.setState({
            starreddirs:data.dirs,
            starredfiles:data.files,
            })
    })
        API.getActivity()
            .then((data)=>{
                this.setState({
                    activity:data.activity,
                })
            })
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="Create"
                primary={true}
                onClick={this.createDir}
            />,
        ];

        const actions1 = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose1}
            />,
            <FlatButton
                label="Create"
                primary={true}
                onClick={this.handleGroupCreation}
            />,
        ];

        const actions2 = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose2}
            />,
            <FlatButton
                label="Create"
                primary={true}
                onClick={this.createSharedDir}
            />,
        ];
    if (this.state.category == "home") {
            return (
                <div>
                    <div style={{float: 'left', width:'22%', height:'100%'}}>
                        <Navbar handleNavClick={this.handleNavClick} handleNavFile={this.handleNavFile}/>
                    </div>
                    <div style={{float:'left', width:'55%'}}>
                        <div role="alert">
                            <div>
                                &nbsp;
                                &nbsp;
                                &nbsp;
                            </div>
                            <div>
                                &nbsp;
                                &nbsp;
                                &nbsp;
                            </div>
                            <div >
                                <strong><h1>Dropbox Home</h1></strong>
                            </div>

                        <div style={{float:'center'}}>
                            <Starred files={this.state.starredfiles} dirs={this.state.starreddirs} activity={this.state.activity} />
                        </div>
                        </div>

                    </div>
                    <div style={{float:'left',width:'20%', height:'100%'}} >

                        &nbsp;
                        &nbsp;
                        <strong>
                            {window.sessionStorage.getItem("key")}
                        </strong><RaisedButton
                        label="Logout"
                        style={{margin:'12', width:'100%'}}
                        type="button"
                        onClick={() => this.props.handleLogout(this.state)}
                        />
                        <RaisedButton
                            label="Create Shared Folder"
                            style={{margin:'12', width:'100%'}}
                            primary={true}
                            type="button"
                            onClick={this.handleOpen2}
                        /><br/>
                        <RaisedButton
                            label="Create Folder"
                            style={{margin:'12', width:'100%'}}
                            primary={true}
                            type="button"
                            onClick={this.handleOpen}
                        /><br/>
                        <RaisedButton
                            label="Create Grpoup"
                            style={{margin:'12', width:'100%'}}
                            type="button"
                            onClick={this.handleOpen1}
                        /><br/>

                        <Upload
                            // className={'fileupload'}
                            style={{margin:'12', width:'100%'}}
                            type="file"
                            name="mypic"
                            onChange={this.handleFileUpload}
                        />

                        <Dialog
                            title="Name your shared folder"
                            actions={actions2}
                            modal={true}
                            open={this.state.open2}
                        >
                            <input
                                type="text"
                                value = {this.state.newdirname}
                                onChange={(event) => {
                                    this.setState({
                                        newdirname: event.target.value
                                    });
                                }}
                            /><br/>
                            <Divider/>
                            <strong>Share with:</strong>
                            {this.state.shareholders.map((shareholder, idx) => (
                                <div className="shareholder">
                                    <TextField
                                        type="text"
                                        placeholder={`person #${idx + 1}`}
                                        value={shareholder.email}
                                        onChange={this.handleShareholderNameChange(idx)}
                                    />
                                    &nbsp;
                                    &nbsp;
                                    <RaisedButton type="button" onClick={this.handleRemoveShareholder(idx)} className="small">-</RaisedButton>
                                </div>
                            ))}


                            <RaisedButton primary={true} type="button" onClick={this.handleAddShareholder} label="Add more" className="small"/>
                        </Dialog>

                        <Dialog
                            title="Enter Group Name"
                            actions={actions1}
                            modal={true}
                            open={this.state.open1}
                        >
                            <input
                                type="text"
                                value = {this.state.newgroupname}
                                onChange={(event) => {
                                    this.setState({
                                        newgroupname: event.target.value
                                    });
                                }}
                            /><br/>
                            <Divider/>
                            {this.state.shareholders.map((shareholder, idx) => (
                                <div className="shareholder">
                                    <TextField
                                        type="text"
                                        placeholder={`person #${idx + 1}`}
                                        value={shareholder.email}
                                        onChange={this.handleShareholderNameChange(idx)}
                                    />
                                    &nbsp;
                                    &nbsp;
                                    <RaisedButton type="button" onClick={this.handleRemoveShareholder(idx)} className="small">-</RaisedButton>
                                </div>
                            ))}


                            <RaisedButton primary={true} type="button" onClick={this.handleAddShareholder} label="Add more" className="small"/>
                        </Dialog>

                        <Dialog
                            title="Name Your Directory"
                            actions={actions}
                            modal={true}
                            open={this.state.open}
                        >
                            <TextField
                                name = "dirname"
                                label = "enter name"
                                value = {this.state.dirname}
                                onChange={(event) => {
                                    this.setState({
                                        dirname: event.target.value
                                    });
                                }}
                            />
                        </Dialog>
                    </div>

                </div>
            )
        }

        else if (this.state.category == "file") {
            return (
                <div>
                    <div style={{float: 'left', width:'22%', height:'100% '}}>
                        <Navbar handleNavClick={this.handleNavClick} handleNavFile={this.handleNavFile}/>
                    </div>
                    <div style={{float:'left', width:'55%', height:'100%'}}>
                        <div role="alert">
                            <div>
                                &nbsp;
                                &nbsp;
                                &nbsp;
                            </div>
                            <div>
                                &nbsp;
                                &nbsp;
                                &nbsp;
                            </div>
                            <div >
                                <strong><h1>Dropbox File</h1></strong>
                            </div>

                            <div style={{float:'center'}}>
                                <div style={{float:'left'}}>
                                    <RaisedButton
                                        style={style}
                                        label="<"
                                        disabled={this.state.disable}
                                        type="button"
                                        onClick={()=> {
                                            var dir = {dirname: this.state.dirarr.pop()}
                                            if (this.state.dirarr == 0) {
                                                API.getFiles()
                                                    .then((data) => {
                                                        console.log(data);
                                                        this.setState({
                                                            files: data.filelist,
                                                            dirs: data.dirlist,
                                                            disable:true,
                                                        });
                                                    });
                                            }
                                            else{
                                                API.getFilesFromDir(dir)
                                                    .then((data) => {
                                                        this.setState({
                                                            files: data.filelist,
                                                            dirs: data.dirlist

                                                        })
                                                    });
                                            }
                                        }}
                                    /></div><br/>{console.log("filessss",this.state.dirs)}
                                <FileGridList files={this.state.files} dirs={this.state.dirs} handleDirClick={this.handleDirClick} getFiles={this.getFiles}/>

                            </div>
                        </div>

                    </div>
                    <div style={{float:'left',width:'20%', height:'100%'}} >
                        &nbsp;
                        &nbsp;
                        <strong>
                            {window.sessionStorage.getItem("key")}
                        </strong>
                        <div style={{ float:'center'}}>
                            <RaisedButton
                        label="Logout"
                        style={{margin:'12', width:'100%'}}
                        type="button"
                        onClick={() => this.props.handleLogout(this.state)}
                        />
                        <RaisedButton
                            label="Create Shared Folder"
                            style={{margin:'12', width:'100%'}}
                            primary={true}
                            type="button"
                            onClick={this.handleOpen2}
                        /><br/>
                        <RaisedButton
                            label="Create Folder"
                            style={{margin:'12', width:'100%'}}
                            primary={true}
                            type="button"
                            onClick={this.handleOpen}
                        /><br/>
                        <RaisedButton
                            label="Create Grpoup"
                            style={{margin:'12', width:'100%'}}
                            type="button"
                            onClick={this.handleOpen1}
                        /><br/>

                        <Dialog
                            title="Name your shared folder"
                            actions={actions2}
                            modal={true}
                            open={this.state.open2}
                        >
                            <input
                                type="text"
                                value = {this.state.newdirname}
                                onChange={(event) => {
                                    this.setState({
                                        newdirname: event.target.value
                                    });
                                }}
                            /><br/>
                            <Divider/>
                            <strong>Share with:</strong>
                            {this.state.shareholders.map((shareholder, idx) => (
                                <div className="shareholder">
                                    <TextField
                                        type="text"
                                        placeholder={`person #${idx + 1}`}
                                        value={shareholder.email}
                                        onChange={this.handleShareholderNameChange(idx)}
                                    />
                                    &nbsp;
                                    &nbsp;
                                    <RaisedButton type="button" onClick={this.handleRemoveShareholder(idx)} className="small">-</RaisedButton>
                                </div>
                            ))}


                            <RaisedButton primary={true} type="button" onClick={this.handleAddShareholder} label="Add more" className="small"/>
                        </Dialog>

                        <Dialog
                            title="Enter Group Name"
                            actions={actions1}
                            modal={true}
                            open={this.state.open1}
                        >
                            <input
                                type="text"
                                value = {this.state.newgroupname}
                                onChange={(event) => {
                                    this.setState({
                                        newgroupname: event.target.value
                                    });
                                }}
                            /><br/>
                            <Divider/>
                            {this.state.shareholders.map((shareholder, idx) => (
                                <div className="shareholder">
                                    <TextField
                                        type="text"
                                        placeholder={`person #${idx + 1}`}
                                        value={shareholder.email}
                                        onChange={this.handleShareholderNameChange(idx)}
                                    />
                                    &nbsp;
                                    &nbsp;
                                    <RaisedButton type="button" onClick={this.handleRemoveShareholder(idx)} className="small">-</RaisedButton>
                                </div>
                            ))}


                            <RaisedButton primary={true} type="button" onClick={this.handleAddShareholder} label="Add more" className="small"/>
                        </Dialog>

                        <Dialog
                            title="Name Your Directory"
                            actions={actions}
                            modal={true}
                            open={this.state.open}
                        >
                            <TextField
                                name = "dirname"
                                label = "enter name"
                                value = {this.state.dirname}
                                onChange={(event) => {
                                    this.setState({
                                        dirname: event.target.value
                                    });
                                }}
                            />
                        </Dialog>

                        <Upload
                            // className={'fileupload'}
                            style={{margin:'12', width:'100%'}}
                            type="file"
                            name="mypic"
                            onChange={this.handleFileUpload}
                        />
                        </div>
                    </div>

                </div>
            )
        }
    else if (this.state.category == "group") {
        return (
            <div>
                <div style={{float: 'left', width:'22%', height:'100%   '}}>
                    <Navbar handleNavClick={this.handleNavClick} handleNavFile={this.handleNavFile}/>
                </div>
                <div style={{float:'left', width:'55%'}}>
                    <div role="alert">
                        <div>
                            &nbsp;
                            &nbsp;
                            &nbsp;
                        </div>
                        <div>
                            &nbsp;
                            &nbsp;
                            &nbsp;
                        </div>
                        <div >
                            <strong><h1>My groups</h1></strong>
                        </div>

                        <div style={{float:'center'}}>
                            <div style={{float:'left'}}>
                                <RaisedButton
                                    style={style}
                                    label="<"
                                    disabled={this.state.disable}
                                    type="button"
                                    onClick={()=> {
                                        var dir = {dirname: this.state.dirarr.pop()}
                                        if (this.state.dirarr == 0) {
                                            API.getFiles()
                                                .then((data) => {
                                                    console.log(data);
                                                    this.setState({
                                                        files: data.filelist,
                                                        dirs: data.dirlist,
                                                        disable:true,
                                                    });
                                                });
                                        }
                                        else{
                                            API.getFilesFromDir(dir)
                                                .then((data) => {
                                                    this.setState({
                                                        files: data.filelist,
                                                        dirs: data.dirlist

                                                    })
                                                });
                                        }
                                    }}
                                />
                            </div><br/>
                            <GroupList groups={this.state.groups}/>
                            {/*<FileGridList files={this.state.files} dirs={this.state.dirs} handleDirClick={this.handleDirClick}/>*/}
                        </div>
                    </div>

                </div>
                <div style={{float:'left',width:'20%', height:'100%'}} >
                    &nbsp;
                    &nbsp;
                    <strong>
                        {window.sessionStorage.getItem("key")}
                    </strong><RaisedButton
                    label="Logout"
                    style={{margin:'12', width:'100%'}}
                    type="button"
                    onClick={() => this.props.handleLogout(this.state)}
                />
                    <RaisedButton
                        label="Create Shared Folder"
                        style={{margin:'12', width:'100%'}}
                        primary={true}
                        type="button"
                        onClick={this.handleOpen2}
                    /><br/>
                    <RaisedButton
                        label="Create Folder"
                        style={{margin:'12', width:'100%'}}
                        primary={true}
                        type="button"
                        onClick={this.handleOpen}
                    /><br/>
                    <RaisedButton
                        label="Create Grpoup"
                        style={{margin:'12', width:'100%'}}
                        type="button"
                        onClick={this.handleOpen1}
                    /><br/>

                    <Dialog
                        title="Name your shared folder"
                        actions={actions2}
                        modal={true}
                        open={this.state.open2}
                    >
                        <input
                            type="text"
                            value = {this.state.newdirname}
                            onChange={(event) => {
                                this.setState({
                                    newdirname: event.target.value
                                });
                            }}
                        /><br/>
                        <Divider/>
                        <strong>Share with:</strong>
                        {this.state.shareholders.map((shareholder, idx) => (
                            <div className="shareholder">
                                <TextField
                                    type="text"
                                    placeholder={`person #${idx + 1}`}
                                    value={shareholder.email}
                                    onChange={this.handleShareholderNameChange(idx)}
                                />
                                &nbsp;
                                &nbsp;
                                <RaisedButton type="button" onClick={this.handleRemoveShareholder(idx)} className="small">-</RaisedButton>
                            </div>
                        ))}


                        <RaisedButton primary={true} type="button" onClick={this.handleAddShareholder} label="Add more" className="small"/>
                    </Dialog>

                    <Dialog
                        title="Enter Group Name"
                        actions={actions1}
                        modal={true}
                        open={this.state.open1}
                    >
                        <input
                            type="text"
                            value = {this.state.newgroupname}
                            onChange={(event) => {
                                this.setState({
                                    newgroupname: event.target.value
                                });
                            }}
                        /><br/>
                        <Divider/>
                        {this.state.shareholders.map((shareholder, idx) => (
                            <div className="shareholder">
                                <TextField
                                    type="text"
                                    placeholder={`person #${idx + 1}`}
                                    value={shareholder.email}
                                    onChange={this.handleShareholderNameChange(idx)}
                                />
                                &nbsp;
                                &nbsp;
                                <RaisedButton type="button" onClick={this.handleRemoveShareholder(idx)} className="small">-</RaisedButton>
                            </div>
                        ))}


                        <RaisedButton primary={true} type="button" onClick={this.handleAddShareholder} label="Add more" className="small"/>
                    </Dialog>

                    <Dialog
                        title="Name Your Directory"
                        actions={actions}
                        modal={true}
                        open={this.state.open}
                    >
                        <TextField
                            name = "dirname"
                            label = "enter name"
                            value = {this.state.dirname}
                            onChange={(event) => {
                                this.setState({
                                    dirname: event.target.value
                                });
                            }}
                        />
                    </Dialog>

                    <Upload
                        // className={'fileupload'}
                        style={{margin:'12', width:'100%'}}
                        type="file"
                        name="mypic"
                        onChange={this.handleFileUpload}
                    />


                </div>

            </div>
        )
    }

    else if (this.state.category == "share") {
        return (
            <div>
                <div style={{float: 'left', width:'22%', height:'100%   '}}>
                    <Navbar handleNavClick={this.handleNavClick} handleNavFile={this.handleNavFile}/>
                </div>
                <div style={{float:'left', width:'55%'}}>
                    <div role="alert">
                        <div>
                            &nbsp;
                            &nbsp;
                            &nbsp;
                        </div>
                        <div>
                            &nbsp;
                            &nbsp;
                            &nbsp;
                        </div>
                        <div style={{float:'left-top', margin:12}}>

                            <strong><h3>Shared with me</h3></strong>
                        </div>

                        <div style={{float:'center'}}>
                            <div style={{float:'left'}}>
                                <RaisedButton
                                    style={style}
                                    label="<"
                                    disabled={this.state.shareddisable}
                                    type="button"
                                    onClick={()=> {
                                        var dir = {dirname: this.state.shareddirarr.pop()}
                                        if (this.state.shareddirarr == 0) {
                                            API.getFiles()
                                                .then((data) => {
                                                    console.log(data);
                                                    this.setState({
                                                        sharedfiles: data.filelist,
                                                        shareddirs: data.dirlist,
                                                        shareddisable:true,
                                                    });
                                                });
                                        }
                                        else{
                                            API.getFilesFromDir(dir)
                                                .then((data) => {
                                                    this.setState({
                                                        sharedfiles: data.filelist,
                                                        shareddirs: data.dirlist

                                                    })
                                                });
                                        }
                                    }}
                                />
                            </div><br/>
                            <SharedFileList files={this.state.sharedfiles} dirs={this.state.shareddirs} handleDirClick={this.handlesharedDirClick}/>
                            {/*<FileGridList files={this.state.files} dirs={this.state.dirs} handleDirClick={this.handleDirClick}/>*/}
                        </div>
                    </div>

                </div>
                <div style={{float:'left',width:'20%', height:'100%'}} >
                    &nbsp;
                    &nbsp;
                    <strong>
                        {window.sessionStorage.getItem("key")}
                    </strong><RaisedButton
                    label="Logout"
                    style={{margin:'12', width:'100%'}}
                    type="button"
                    onClick={() => this.props.handleLogout(this.state)}
                />
                    <RaisedButton
                        label="Create Shared Folder"
                        style={{margin:'12', width:'100%'}}
                        primary={true}
                        type="button"
                        onClick={this.handleOpen2}
                    /><br/>
                    <RaisedButton
                        label="Create Folder"
                        style={{margin:'12', width:'100%'}}
                        primary={true}
                        type="button"
                        onClick={this.handleOpen}
                    /><br/>
                    <RaisedButton
                        label="Create Grpoup"
                        style={{margin:'12', width:'100%'}}
                        type="button"
                        onClick={this.handleOpen1}
                    /><br/>

                    <Dialog
                        title="Name your shared folder"
                        actions={actions2}
                        modal={true}
                        open={this.state.open2}
                    >
                        <input
                            type="text"
                            value = {this.state.newdirname}
                            onChange={(event) => {
                                this.setState({
                                    newdirname: event.target.value
                                });
                            }}
                        /><br/>
                        <Divider/>
                        <strong>Share with:</strong>
                        {this.state.shareholders.map((shareholder, idx) => (
                            <div className="shareholder">
                                <TextField
                                    type="text"
                                    placeholder={`person #${idx + 1}`}
                                    value={shareholder.email}
                                    onChange={this.handleShareholderNameChange(idx)}
                                />
                                &nbsp;
                                &nbsp;
                                <RaisedButton type="button" onClick={this.handleRemoveShareholder(idx)} className="small">-</RaisedButton>
                            </div>
                        ))}


                        <RaisedButton primary={true} type="button" onClick={this.handleAddShareholder} label="Add more" className="small"/>
                    </Dialog>

                    <Dialog
                        title="Enter Group Name"
                        actions={actions1}
                        modal={true}
                        open={this.state.open1}
                    >
                        <input
                            type="text"
                            value = {this.state.newgroupname}
                            onChange={(event) => {
                                this.setState({
                                    newgroupname: event.target.value
                                });
                            }}
                        /><br/>
                        <Divider/>
                        {this.state.shareholders.map((shareholder, idx) => (
                            <div className="shareholder">
                                <TextField
                                    type="text"
                                    placeholder={`person #${idx + 1}`}
                                    value={shareholder.email}
                                    onChange={this.handleShareholderNameChange(idx)}
                                />
                                &nbsp;
                                &nbsp;
                                <RaisedButton type="button" onClick={this.handleRemoveShareholder(idx)} className="small">-</RaisedButton>
                            </div>
                        ))}


                        <RaisedButton primary={true} type="button" onClick={this.handleAddShareholder} label="Add more" className="small"/>
                    </Dialog>

                    <Dialog
                        title="Name Your Directory"
                        actions={actions}
                        modal={true}
                        open={this.state.open}
                    >
                        <TextField
                            name = "dirname"
                            label = "enter name"
                            value = {this.state.dirname}
                            onChange={(event) => {
                                this.setState({
                                    dirname: event.target.value
                                });
                            }}
                        />
                    </Dialog>

                    <Upload
                        // className={'fileupload'}
                        style={{margin:'12', width:'100%'}}
                        type="file"
                        name="mypic"
                        onChange={this.handleFileUpload}
                    />


                </div>

            </div>
        )
    }

    else{
            return(
            //<Redirect to ="/"/>
                this.props.history.push("/")
                )
        }
    }
}

export default withRouter(Welcome);