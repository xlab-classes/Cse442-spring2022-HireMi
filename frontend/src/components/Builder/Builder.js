import React, {useState, useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@mui/material/Box";
import './Builder.css';
import Draggable from 'react-draggable';
import InputBase from '@material-ui/core/InputBase';
import html2canvas from 'html2canvas';
import { Button } from '@material-ui/core';

const styling = makeStyles({
    container: {
        height: "50%",
        minHeight: 820,
        textAlign: "center",
    }
});

const Builder = ({auth, resume, setEditor, setResume}) => {
    const columns = styling();
    let thumbnail;
    useEffect(() => {

    }, []);


    const capture = (thumbnail) => {
        html2canvas(document.getElementById('resume'))
            .then(function (canvas) {
                thumbnail = canvas.toDataURL("image/jpeg", 0.9);
            });
    }

    const data = {
        "resume_id": auth?.id,
        "share": 1,
        "elements": [{
            "type": "text",
            "offset-x": 100,
            "offset-y": 100,
            "width":    100,
            "height":   100,
            "content": "HelloWorld",
            "z-index":  1,
            "prop": {"font-type": "arial", "font-size": 12}
        }]
    }

    const json_body = {
        'id': auth?.id, 
        'thumbnail': thumbnail,
        'data': data
    }
    
    const string_body = JSON.stringify(json_body);

    function download(url) {
        const stringURL = url.toString();
        const a = document.createElement('a')
        a.href = stringURL
        a.download = stringURL.split('/').pop()
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    const saveResume = () => {
        capture(thumbnail);
        fetch('./backend/api/api.php/resume/', {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + auth?.access_token
            },

            body: string_body

        }).then((result) => console.log(result))

        const url = './backend/api/' + auth?.id +'.pdf';

        download(url);
    }
    


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
                        <div id='resume'>
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
                        <Button onClick={saveResume}>Download PDF</Button>
                    </div>
                </div>
            </Grid>
        </Grid>
    );
}

export default Builder;
