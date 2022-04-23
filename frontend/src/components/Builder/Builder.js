import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
// import Grid from "@material-ui/core/Grid";
import Box from "@mui/material/Box";
import styles from './Builder.module.scss';
import { Rnd } from "react-rnd";
import { sampleRawData } from "./hardCodedData.js";
import html2canvas from 'html2canvas';
import { parse } from "@fortawesome/fontawesome-svg-core";

const styling = makeStyles({
    container: {
        height: "50%",
        minHeight: 820,
        textAlign: "center",
    }
});

const tempData = sampleRawData

const Builder = ({ auth, resume, setEditor, setResume }) => {
    const columns = styling();

    const [mappedData, updateData] = useState(null);
    // Increment for tracking newly added object
    const [increment, setIncrement] = useState(null);
    // state to set active status of deleting an element
    const [isDelete, setDelete] = useState({
        active: false,
        id: null,
    });
    const [isDragging, setDragging] = useState(false);

    const [share, setShare] = useState(false);
    const [fontSize, setFontSize] = useState(14);
    const [boldfont, setBoldFont] = useState(false);
    const [italfont, setItalFont] = useState(false);
    const [underfont, setUnderFont] = useState(false);
    // const [fontSize_exp,setFontSize_exp] = useState(12);
    // const [fontSize_edu,setFontSize_edu] = useState(12);

    useEffect(() => {

        const loadingElements = async () => {

            //Checks if loading resume is a template.
            //If it is, then we create a new resume that is owned by user.
            if (resume.split('-')[1] === 'template') {
                //This gets the number of resumes in entire database, not just the ones the user owns.
                const resumeCount = await fetch('./backend/api/api.php/resume_count', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + auth?.access_token
                    },
                    body: JSON.stringify({
                        'id': auth?.id
                    })
                }).catch(err => {
                    console.error(err)
                });

                const resumeCountJSON = await resumeCount.json();
                setResume((resumeCountJSON.count + 1) + '-doc');
                // immediate save doesn't work, but there's possibility of error if
                // separate users save at the same time
                // encodeData(mappedData)
            }


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

            console.log(resumeDataJSON)

            const parsedData = resumeDataJSON['elements'].reduce((obj, el) => {
                const id = obj['prev'] + 1;
                return (
                    {
                        ...obj,
                        prev: id,
                        [id]: {
                            ...el,
                            'content': el['type'] === "image" ? 'data:image/png;base64,' + el['content'] : el['content']
                        }
                    }
                )
            }, {prev: 0})

            console.log(parsedData)

            setIncrement(parsedData['prev'] + 1);
            updateData(parsedData); // updates mapped data
        }

        loadingElements()
            .catch(console.error);
    }, []);

    function renderData() {
        // assume that we fetched the data successfully
        const remapped = tempData["elements"].reduce(
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
        const thumbnail = await capture();
        for (let i = 0; i < filteredData.length; i++) {
            const element = filteredData[i];
            console.log(element);
            if (element.type === "image") {
                element.content = element.content.split(',')[1];
            }
        }
        return saveElements(filteredData, thumbnail.split(',')[1]); //pass only data, no prefix
    }

    async function saveElements(encodedData, thumbnail) {
        const result = await fetch('./backend/api/api.php/resume', {
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
        });

        return result;
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

    async function download() {
        const response = await encodeData(mappedData); //should save before download
        const responseText = await response.text();
        console.log(responseText);
        
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

    // Add TEXT

    function addText() {
        const currentPrev = increment

        const newData = {
            ...mappedData,
            [currentPrev]: {
                "type": "text",
                "content": "text element",
                "offset-x": 0,
                "offset-y": 0,
                "width": 100,
                "height": 30,
                "z-index": 1,
                "prop": {"font-type": "arial", "font-size": 12}
            },
            prev: currentPrev
        }

        updateData(newData);
        setIncrement(increment + 1)

    }

    async function addImage(e) {
        const currentPrev = increment

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
            setIncrement(increment + 1)
        }
        img.src = base64
    }

    function controlElement(e, id) {
        if(isDelete['active'] && isDelete['id'] !== id) {
            setDelete({
                active: true,
                id: id
            });
        }else {
            setDelete({
                active: !isDelete['active'],
                id: isDelete['id'] ? null : id
            });
        }
    }

    function deleteElement(id) {

        const updatedMap = {
            ...mappedData
        }

        delete updatedMap[id]

        setDelete({
            active: false,
            id: null
        });
        updateData(updatedMap);
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

    const style_temp = {
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
    }


    const renderedData = Object.entries(mappedData ? mappedData : {}).map(el => {
            if (el[0] === 'prev') {
                return null;
            }

            return (
                <Rnd
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        textAlign: 'center',
                        border: !isDragging && isDelete['active'] && el[0] === isDelete['id'] ? '3px solid red' : 'none',
                    }}
                    default={{
                        x: el[1]['offset-x'],
                        y: el[1]['offset-y'],
                        width: el[1]['width'],
                        height: el[1]['height']
                    }}
                    key={el[0]}

                    onDragStart={e => {
                        setDragging(true)
                    }}
                    onDrag={e => {
                        if (!isDelete['active']) {
                            return
                        }
                        setDelete({
                            active: false,
                            id: null
                        })
                    }}
                    onDragStop={(e, data) => {
                        setDragging(false)

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

                    onMouseDown={e => {
                        // if(isDragging) return;

                        // controlElement(e, el[0])

                        setTimeout(()=>{
                            if(isDragging) return;
                            controlElement(e, el[0])
                        },50);
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
                                // textAlign: 'center',
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
                            style={style_temp}
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
                            style={style_temp}
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
                            style={style_temp}
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
                        <div className={styles['left_buttons_area']}>
                            <button onClick={addText} className={styles['add_text_button']}>
                                Add Text
                            </button>
                            <input type='file' className={styles['add_image_button']} accept="image/*" onChange={addImage} />
                            {isDelete['active'] ? <button className={styles['delete_element_button']} onClick={() => deleteElement(isDelete['id'])}>
                                delete element (id: {isDelete["id"]} )
                            </button> : <button disabled={true}>
                                delete element (id: {isDelete["id"]} )
                            </button>}
                        </div>

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
                                }}
                                >
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
                        <div className={styles['right_buttons_area']}>
                            <button className={styles['save_button']} onClick={() => encodeData(mappedData)}>
                                Save Resume
                            </button>
                            <button className={styles['download_button']} onClick={() => { download() }}>
                                Download PDF
                            </button>
                            <button className={styles['close_button']} onClick={() => {
                                setResume(null)
                                setEditor(false)
                            }}> Close Editor
                            </button>
                        </div>
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
