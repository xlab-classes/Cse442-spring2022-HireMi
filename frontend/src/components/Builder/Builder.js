import React, {useState, useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@mui/material/Box";
import styles from './Builder.module.scss';
import Draggable from 'react-draggable';
import InputBase from '@material-ui/core/InputBase';

const styling = makeStyles({
    container: {
        height: "50%",
        minHeight: 820,
        textAlign: "center",
    }
});
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
const Builder = ({auth, resume, setEditor, setResume}) => {
    const columns = styling();

    useEffect(() => {

    }, []);
    const [fontSize, setFontSize] = useState(12);
    const [boldfont, setBoldFont] = useState(false);
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
    return (
        <div className={styles['page-root']}>
            <Grid container direction="row" spacing={1}>
                <button onClick={() => {
                    setResume(null)
                    setEditor(false)
                }}>Close
                </button>
                <Grid item xs>
                    <div className='dnd'>
                        <div className={columns.container}>
                            <h1 className='dnd_h1'>Drag and Drop</h1>
                            <Draggable>
                                <div className='yourname'>
                                    <Box sx={{
                                        width: 245,
                                        height: 48,
                                        background: "#ffff"
                                    }}>

                                    <InputBase 
                                        className='yourname_input' 
                                        defaultValue="Your Names" 
                                        style={{fontSize: fontSize, fontWeight: boldfont ? 'bold' : 'normal'}}
                                        // onClick={this.eventHandler}
                                         />
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
                                    <InputBase 
                                        className='education' 
                                        defaultValue="Education"
                                        style={{fontSize: fontSize, fontWeight: boldfont ? 'bold' : 'normal'}} 
                                        // onClick={this.eventHandler}
                                        />
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
                                        <InputBase
                                            className='education'
                                            defaultValue="Education"
                                            style={{fontSize: fontSize, fontWeight: boldfont ? 'bold' : 'normal'}}
                                            // onClick={this.eventHandler}
                                        />
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
                                        <InputBase
                                            className='experience'
                                            defaultValue="Experience"
                                            style={{fontSize: fontSize, fontWeight: boldfont ? 'bold' : 'normal'}}
                                            // onKeyDown={this.onKeyDown}
                                        />
                                    </Box>
                                </div>
                            </Draggable>
                            <Draggable>
                                <div className='New Image'>
                                    <Box>

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
                            <h2 className='cus_h2'>Customize!</h2>
                            <div className='textEdit'>
                                <Box sx={{
                                    width: 200,
                                    height: 286,
                                    background: "#ffff"
                                }}>
                                    <h3 className='txt_h3'>Text</h3>
                                    <button className="increase" onClick={() => {
                                        increaseFS();
                                    }}>A+
                                    </button>
                                    <button className="decrease" onClick={() => {
                                        decreaseFS();
                                    }}>A-
                                    </button>
                                    <button className='bold' onClick={() => {
                                        boldF();
                                    }}>Bold
                                    </button>
                                </Box>
                            </div>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    );

}

export default Builder;
