import React, {useState, useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
// import Grid from "@material-ui/core/Grid";
import Box from "@mui/material/Box";
import styles from './Builder.module.scss';
import {Rnd} from "react-rnd";
import {sampleRawData} from "./hardCodedData.js";
import html2canvas from 'html2canvas';

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

const tempData = sampleRawData

const Builder = ({auth, resume, setEditor, setResume}) => {
    const columns = styling();


    const [rawDoc, updateDoc] = useState(tempData)
    const [mappedData, updateData] = useState(null);

    const [increment, setIncrement] = useState(null);
    const [share, setShare] = useState(false);
    const [fontSize, setFontSize] = useState(14);
    const [boldfont, setBoldFont] = useState(false);
    const [italfont, setItalFont] = useState(false);
    const [underfont, setUnderFont] = useState(false);
    // const [fontSize_exp,setFontSize_exp] = useState(12);
    // const [fontSize_edu,setFontSize_edu] = useState(12);

    useEffect(() => {

        const loadingElements = async () => {

            const resumeData = await fetch('./backend/api/api.php/get_resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth?.access_token
                },
                body: JSON.stringify({
                    'id': auth?.id,
                    'resume_id': parseInt(resume.split('-')[0])
                })
            })

            const resumeDataJSON = await resumeData.json();
            updateDoc(resumeDataJSON); //updates rawDoc

            //passing this instead of rawDoc because doesn't update immediately
            renderData(resumeDataJSON);
        }

        loadingElements();

    }, []);

    function renderData(rawData) {
        // assume that we fetched the data successfully
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
        const filteredData = Object.values(formattedData).filter(el => {
            if (typeof el === 'object') {
                return el
            } else {
                return null
            }
        })

        // Upload filteredData to push it to the server
        console.log(filteredData);
        const thumbnail = await capture();
        saveElements(filteredData, thumbnail.split(',')[1]); //pass only data, no prefix
    }

    async function saveElements (encodedData, thumbnail) {
        await fetch('./backend/api/api.php/resume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth?.access_token
            },
            body: JSON.stringify({
                'id': auth?.id,
                'thumbnail': thumbnail,
                'data': {
                    'resume_id': parseInt(resume.split('-')[0]),
                    'share': 1,
                    'elements': encodedData
                }
            })
        })
        .then((result) => result.text())
        .then((resultText) => {
            console.log(resultText);
        })
        // Not need since output isn't json and just confirms save.
        // .then((resultJson) => {
        //     console.log("Successfully saved resume.",resultJson);
        // })
    }

    const capture = async () => {
        const element = document.getElementsByClassName('MuiBox-root css-s2v7vp');
        const canvas = await html2canvas(element[0]);
        const link = canvas.toDataURL("image/png");
        return link;
    }

    function download() {
        encodeData(mappedData); //should save before download
        //resume.split('-')[0] returns a string of an int, which is okay in this case
        const url = './backend/api/' + resume.split('-')[0] + '.pdf';

        const stringURL = url.toString();
        const a = document.createElement('a')
        a.href = stringURL
        a.download = stringURL.split('/').pop()
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    function convertBase64(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = error => {
                reject(error);
            }
        });
    }

    async function addImage(e) {
        const currentPrev = mappedData['prev'] + 1

        const file = e.target.files[0];
        const base64 = await convertBase64(file);

        let img = new Image;
        img.onload = () => {
            const newData = {
                ...mappedData,
                [currentPrev]: {
                    "type": "image",
                    "offset-x": 0,
                    "offset-y": 0,
                    "width": img.width ? img.width : 100,
                    "height": img.height ? img.height : 100,
                    "z-index": 1,
                    "content": base64,
                    "prop": {}
                },
                prev: currentPrev
            }

            updateData(newData);
        }
        img.src = base64

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
                        <img src={el[1]['content']} alt={''} draggable={false}
                             style={{
                                 width: '100%',
                                 height: '100%',
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
                        <input type='file' accept="image/*" onChange={addImage}/>
                        <button className={styles['saveButton']} onClick={() => {
                            setResume(null)
                            setEditor(false)
                        }}>Save Resume
                        </button>
                        <button classname={styles['closeButton']} onClick={() => {
                            download()
                        }}>Download Button
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