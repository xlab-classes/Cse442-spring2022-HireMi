import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@mui/material/Box";
import styles from './Builder.module.scss';
import { Rnd } from "react-rnd";
import html2canvas from 'html2canvas';
import ConvertApi from 'convertapi-js';

const styling = makeStyles({
    container: {
        height: "50%",
        minHeight: 820,
        textAlign: "center",
    }
});
const style = {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center'
}
// function FontChange () {
//     const [FontSize, setFontSize] = useState(14);
//     const increaseFS = () => setFontSize(FontSize + 1)
//     const decreaseFS = () => setFontSize(FontSize - 1)
//     return (
//         <div>
//             <Builder changeFS_in={increaseFS} changeFS_de={decreaseFS} fontSize={setFontSize}/>
//         </div>
//     );
// }

const tempData = {
    "elements": [
        {
            "type": "text",
            "content": "some string",
            "offset-x": 100,
            "offset-y": 100,
            "width": 100,
            "height": 100,
            "z-index": 1,
            "prop": { "font-type": "arial", "font-size": 12 }
        },
    ]
}



const Builder = ({ auth, resume, setEditor, setResume }) => {
    const columns = styling();

    useEffect(() => {
        // assume that we fetched the data successfully
    }, []);

    const [rawDoc, updateDoc] = useState(tempData)

    const [fontSize, setFontSize] = useState(14);
    const [boldfont, setBoldFont] = useState(false);
    const [italfont, setItalFont] = useState(false);
    const [underfont, setUnderFont] = useState(false);
    // const [fontSize_exp,setFontSize_exp] = useState(12);
    // const [fontSize_edu,setFontSize_edu] = useState(12);

    const increaseFS = () => {
        setFontSize(fontSize + 1);
    };
    const decreaseFS = () => {
        setFontSize(fontSize - 1);
    };
    const boldF = () => {
        setBoldFont(!boldfont);
    };
    const italF = () => {
        setItalFont(!italfont);
    };
    const underF = () => {
        setUnderFont(!underfont);
    };

    function downloadHandler() {
        let imgString;
        let resume = document.getElementById('screenshot');
        html2canvas(resume)
        .then(function (canvas) {
            imgString = canvas.toDataURL("image/png", 0.9).replace(/^[^,]+, */, '');
            console.log(imgString);
        })
        .then(() => {
            const resumeID = 1;
            const data = {
                "resume_id": resumeID,
                "share": 1,
                "elements": [{
                    "type": "text",
                    "offset-x": 100,
                    "offset-y": 100,
                    "width": 100,
                    "height": 100,
                    "content": 'helloworld',
                    "z-index": 1,
                    "prop": { "font-type": "arial", "font-size": 12 }
                }]
            }

            const json_body = {
                'id': auth?.id,
                'thumbnail': imgString,
                'data': data
            }

            console.log('b');

            const json_string = JSON.stringify(json_body);

            fetch('./backend/api/api.php/resume/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + auth?.access_token
                },

                body: json_string

            })
                .then((result) => console.log(result))
                .then(() => {
                    const url = 'http://localhost/CSE442-542/2022-Spring/cse-442r/backend/api/' + resumeID + '.pdf';
                    console.log(url);
                    var link = document.createElement('a');
                    link.href = url;
                    link.download = 'myresume.pdf';
                    link.dispatchEvent(new MouseEvent('click'));
                    console.log('yea');
                })
                .catch(error => { console.log('error: ', error) });

        })
        .catch((e) => {console.log(e)})



    };

    return (
        <div className={styles['page-root']}>
            <Grid container direction="row" spacing={1}>
                <Grid item xs>
                    <div className={styles['dnd']}>
                        <div className={columns.container}>
                            <h1 className={styles['dnd_h1']}>Drag and Drop</h1>
                            <Rnd
                                // className={styles['rnd_drag']}
                                style={style}
                                default={{
                                    x: 50,
                                    y: 85,
                                    width: 213,
                                    height: 43
                                }}
                            >
                                <input 
                                type="text" 
                                defaultValue={'Your Name'} 
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    fontSize: fontSize, 
                                    fontWeight: boldfont ? 'bold' : 'normal', 
                                    fontStyle: italfont ? 'italic' : 'normal',
                                    textDecorationLine: underfont ? 'underline' : 'none',
                                    border: 'none',
                                    textAlign: 'center'
                                }}
                                />
                            </Rnd>
                            <Rnd
                                // className={styles['rnd_drag']}
                                style={style}
                                default={{
                                    x: 50,
                                    y: 140,
                                    width: 213,
                                    height: 43
                                }}
                            >
                                <input 
                                type="text" 
                                defaultValue={'Education'} 
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    fontSize: fontSize, 
                                    fontWeight: boldfont ? 'bold' : 'normal', 
                                    fontStyle: italfont ? 'italic' : 'normal',
                                    textDecorationLine: underfont ? 'underline' : 'none',
                                    border: 'none',
                                    textAlign: 'center'
                                }}
                                />
                            </Rnd>
                            <Rnd
                                // className={styles['rnd_drag']}
                                style={style}
                                default={{
                                    x: 50,
                                    y: 191,
                                    width: 213,
                                    height: 43
                                }}
                            >
                                <input 
                                type="text" 
                                defaultValue={'Experience'} 
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    fontSize: fontSize, 
                                    fontWeight: boldfont ? 'bold' : 'normal', 
                                    fontStyle: italfont ? 'italic' : 'normal',
                                    textDecorationLine: underfont ? 'underline' : 'none',
                                    border: 'none',
                                    textAlign: 'center'
                                }}
                                />
                            </Rnd>
                        </div>
                    </div>
                </Grid>

                <Grid item xs={5}>
                    <div id='screenshot' className={styles['middle']}>
                        <div className={columns.container}>
                            <div className={styles['resume']}>
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
                    <div className={styles['cus']}>
                        <div className={columns.container}>
                            <h2 className={styles['cus_h2']}>Customize!</h2>
                            <div className={styles['textEdit']}>
                                <Box sx={{
                                    width: 200,
                                    height: 286,
                                    background: "#ffff"
                                }}>
                                    <h3 className={styles['txt_h3']}>Text</h3>
                                    <button className={styles['increase']} onClick={() => {
                                        increaseFS();
                                    }}>A+
                                    </button>
                                    <button className={styles['decrease']} onClick={() => {
                                        decreaseFS();
                                    }}>A-
                                    </button>
                                    <button className={styles['bold']} onClick={() => {
                                        boldF();
                                    }}>Bold
                                    </button>
                                    <button className={styles['italicized']} onClick={() => {
                                        italF();
                                    }}>Italic
                                    </button>
                                    <button className={styles['underline']} onClick={() => {
                                        underF();
                                    }}>U
                                    </button>
                                </Box>
                            </div>
                            <button className={styles['closeButton']} onClick={() => {
                                setResume(null)
                                setEditor(false)
                            }}>Close
                            </button>
                            <button className='downloadButton' onClick={downloadHandler}>
                                Download PDF
                            </button>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    );

}

export default Builder;
