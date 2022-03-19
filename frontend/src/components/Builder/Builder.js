import React, {useState, useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@mui/material/Box";
import './Builder.css';
import Draggable from 'react-draggable';
import InputBase from '@material-ui/core/InputBase';

const styling = makeStyles({
    container: {
        height: "50%",
        minHeight: 820,
        textAlign: "center",
    }
});

const Builder = ({auth, resume, setEditor, setResume}) => {
    const columns = styling();

    useEffect(() => {

    }, []);

    return (
        <Grid container direction="row" spacing={1}>
            <button onClick={()=>{
                setResume(null)
                setEditor(false)
            }}>Close</button>
            <Grid item xs>
                <div className='dnd'>
                    <div className={columns.container}>
                        <h1>Drag and Drop</h1>
                        <Draggable>
                            <div className='yourname'>
                                <Box sx={{
                                    width: 245,
                                    height: 48,
                                    background: "#ffff"
                                }}>
                                    <InputBase className='yourname_input' defaultValue="Your Name" />
                                </Box>
                            </div>
                        </Draggable>
                        <Draggable>
                            <div className='education'>
                                <Box sx={{
                                    width: 245,
                                    height: 48,
                                    background: "#ffff"
                                }}>
                                    <InputBase className='education' defaultValue="Education" />
                                </Box>
                            </div>
                        </Draggable>
                        <Draggable>
                            <div className='experience'>
                                <Box sx={{
                                    width: 245,
                                    height: 48,
                                    background: "#ffff"
                                }}>
                                    <InputBase className='experience' defaultValue="Experience" />
                                </Box>
                            </div>
                        </Draggable>
                    </div>
                </div>
            </Grid>

            <Grid item xs={5}>
                <div className='middle'>
                    <div className={columns.container}>
                        <div className='resume'>
                            <Box sx={{
                                width: 595,
                                height: 812,
                                border: ".5px solid black"
                            }}>
                            </Box>
                        </div>
                    </div>
                </div>
            </Grid>

            <Grid item xs>
                <div className='cus'>
                    <div className={columns.container}>
                        <h2>Customize!</h2>
                        <div className='textEdit'>
                            <Box sx={{
                                width: 200,
                                height: 286,
                                background: "#ffff"
                            }}>
                                <h3>Text</h3>
                            </Box>
                        </div>
                    </div>
                </div>
            </Grid>
        </Grid>
    );
}

export default Builder;
