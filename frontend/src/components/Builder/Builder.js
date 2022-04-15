import React, {useState, useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
// import Grid from "@material-ui/core/Grid";
import Box from "@mui/material/Box";
import styles from './Builder.module.scss';
import {Rnd} from "react-rnd";

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

const tempData = {
    "elements": [
        {
            "type": "text",
            "content": "some string 1",
            "offset-x": 100,
            "offset-y": 120,
            "width": 100,
            "height": 100,
            "z-index": 1,
            "prop": {"font-type": "arial", "font-size": 12}
        },
        {
            "type": "text",
            "content": "some string 2",
            "offset-x": 70,
            "offset-y": 140,
            "width": 100,
            "height": 100,
            "z-index": 2,
            "prop": {"font-type": "arial", "font-size": 12}
        },
        {
            "type": "text",
            "content": "some string 3",
            "offset-x": 10,
            "offset-y": 160,
            "width": 100,
            "height": 100,
            "z-index": 3,
            "prop": {"font-type": "arial", "font-size": 12}
        }
        , {
            "type": "text",
            "content": "some string 4",
            "offset-x": 40,
            "offset-y": 200,
            "width": 100,
            "height": 100,
            "z-index": 4,
            "prop": {"font-type": "arial", "font-size": 12}
        }
    ]
}

const Builder = ({auth, resume, setEditor, setResume}) => {
    const columns = styling();


    const [rawDoc, updateDoc] = useState(tempData)
    const [mappedData, updateData] = useState(null);

    const [increment, setIncrement] = useState(null);

    const [fontSize, setFontSize] = useState(14);
    const [boldfont, setBoldFont] = useState(false);
    const [italfont, setItalFont] = useState(false);
    const [underfont, setUnderFont] = useState(false);
    // const [fontSize_exp,setFontSize_exp] = useState(12);
    // const [fontSize_edu,setFontSize_edu] = useState(12);

    useEffect(() => {
        // assume that we fetched the data successfully
        const remapped = rawDoc["elements"].reduce(
            (obj, el) => {
                const id = obj['prev'] + 1;
                return (
                    {
                        ...obj,
                        prev: id,
                        [id]: {
                            ...el
                        }
                    }
                )
            }
            , {prev: 0}
        )

        setIncrement(remapped['prev'] + 1);
        updateData(remapped);

        // Needs to be integrated with the fetch API
        // renderData(rawDoc)

    }, []);

    function renderData(rawData) {
        const remapped = rawData["elements"].reduce(
            (obj, el) => {
                const id = obj['prev'] + 1;
                return (
                    {
                        ...obj,
                        prev: id,
                        [id]: {
                            ...el
                        }
                    }
                )
            }
            , {prev: 0}
        )

        setIncrement(remapped['prev'] + 1);
        updateData(remapped);
    }

    // This function needs to be paired with the save using fetch API
    async function encodeData(formattedData) {
        const filteredData = Object.values(formattedData).filter(el =>{
            if(typeof el === 'object') {
                return el
            }else {
                return null
            }
        })

        // Upload filteredData to push it to the server

    }

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


    const renderedData = Object.entries(mappedData ? mappedData : {}).map(el => {
            if (el[0] === 'prev') {
                return null;
            }

            return (
                <Rnd
                    style={style}
                    default={{
                        x: el[1]['offset-x'],
                        y: el[1]['offset-y'],
                        width: el[1]['width'],
                        height: el[1]['height']
                    }}
                    key={el[0]}
                    onDragStop={(e, data) => {
                        // console.log(data)

                        const updated = {
                            ...mappedData,
                            [el[0]]: {
                                ...mappedData[el[0]],
                                'offset-x': data['x'],
                                'offset-y': data['y'],
                            }
                        }

                        updateData(updated);
                    }}
                    onResizeStop={(e, dir, ref, delta, position) => {
                        // console.log(position)

                        const updated = {
                            ...mappedData,
                            [el[0]]: {
                                ...mappedData[el[0]],
                                width: mappedData[el[0]]['width'] + delta['width'],
                                height: mappedData[el[0]]['height'] + delta['height'],
                                'offset-x': position['x'],
                                'offset-y': position['y'],
                            }
                        }

                        updateData(updated);
                    }}
                >
                    {el[1]['type'] === 'text' ?
                        <input
                            type="text"
                            defaultValue={el[1]['content']}
                            style={{
                                width: '100%',
                                height: '100%',
                                fontSize: fontSize,
                                fontWeight: boldfont ? 'bold' : 'normal',
                                fontStyle: italfont ? 'italic' : 'normal',
                                textDecorationLine: underfont ? 'underline' : 'none',
                                border: 'none',
                                textAlign: 'center',
                                backgroundColor: 'grey'
                            }}
                            onChange={e => {
                                const str = e.target.value;

                                const updated = {
                                    ...mappedData,
                                    [el[0]]: {
                                        ...mappedData[el[0]],
                                        content: str
                                    }
                                }

                                updateData(updated);
                            }}
                        /> :
                        <img src={''} alt={''}
                             style={{
                                 width: '100%',
                                 height: 'auto',
                             }}
                        />
                    }
                </Rnd>
            )

        }
    );

    return (
        <div className={styles['page-root']}>
            {/* <Grid container direction="row" spacing={1}>
                <Grid item xs> */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '320px 629px 320px',
                    justifyContent: 'space-around'
                }}>

                <aside>
                    <div className={styles['dnd']}>
                        {/* <div className={columns.container}> */}
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
                    {/* </div> */}
                </aside>

                {/* </Grid>

                <Grid item xs={5}> */}
                <section>
                    <div className={styles['middle']}>
                        <div className={columns.container}>
                            <div className={styles['resume']}>
                                <Box sx={{
                                    width: 629,
                                    height: 814,
                                    border: ".5px solid black",
                                    background: "white"
                                }}>
                                    {renderedData}
                                </Box>
                            </div>
                        </div>
                    </div>
                </section>

                {/* </Grid>

                <Grid item xs> */}
                <aside>
                    <div className={styles['cus']}>
                        {/* <div className={columns.container}> */}
                        <h2 className={styles['cus_h2']}>Customize!</h2>
                        <div className={styles['textEdit']}>
                            <Box sx={{
                                width: 200,
                                height: 286,
                                background: "#ffff",
                                margin: '0 auto'
                            }}>
                                <h3 className={styles['txt_h3']}>Text</h3>
                                <input
                                    className={styles["fontSize_input"]}
                                    defaultValue={fontSize}
                                    // value={fontSize}
                                    onChange={renderedData.entries[1]}
                                />
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
                        }}>Close Editor
                        </button>
                        <button onClick={() => encodeData(mappedData)}>
                            TEST button for encoder
                        </button>
                    </div>
                    {/* </div> */}
                </aside>
            </div>


            {/* </Grid>
            </Grid> */}
        </div>
    );

}

export default Builder;
